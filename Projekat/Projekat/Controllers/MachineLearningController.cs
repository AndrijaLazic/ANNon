using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using Projekat.Modeli;
using System.Net.Http.Headers;
using Microsoft.CodeAnalysis.RulesetToEditorconfig;
using ChoETL;
using Projekat.Ostalo;
using Projekat.Data;

namespace Projekat.Clients
{

    public static class FormFileExtensions
    {
        public static async Task<byte[]> GetBytes(this IFormFile formFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class MachineLearningController : ControllerBase
    {
        private readonly MachineLearningClient _iCustomClient;
        private readonly MySqlDbContext _context;
        private readonly IConfiguration configuration;
        private static int VelicinaCsvFajla=0;
        public MachineLearningController(MachineLearningClient iCustomClient,MySqlDbContext context, IConfiguration configuration)
        {
            _iCustomClient = iCustomClient;
            _context = context;
            this.configuration = configuration;
            VelicinaCsvFajla = int.Parse(configuration.GetSection("AppSettings:TrajanjeEmailTokenaUMinutima").Value.ToString());
        }

        [HttpGet("mean")]
        public async Task<ActionResult<String>> Test()
        {
            String k = await _iCustomClient.GetMean();
            Console.WriteLine(k.ToString());
            return Ok(k);
        }



        //[RequestFormLimits(ValueLengthLimit = 3000, MultipartBodyLengthLimit = 3000)]
        [RequestSizeLimit(100000000)]
        [HttpPost("uploadFile")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile uploadedFile, [FromForm]string userID, [FromForm] string? PrvoSlanje)
        {
            if(PrvoSlanje!=null)
                return Ok(true);
            string imeFajla;
            try
            {
                if (uploadedFile.Length > 0)
                {
                    if (RadSaFajlovima.ProveriAkoJeCsvFajl(uploadedFile))
                    {
                        if ((imeFajla = await RadSaFajlovima.UpisiFajl(uploadedFile))!=null)
                        {
                            DataModel dataModel = new DataModel
                            {
                                userID = userID,
                                FileName = imeFajla,
                                Putanja = "put",
                                VremeUploada= DateTime.Now.ToString("h:mm:ss tt")
                        };
                            _context.Files.Add(dataModel);
                            await _context.SaveChangesAsync();
                            return Ok(true);
                        }
                        return BadRequest("Greška pri čuvanju fajla");
                    }
                    return BadRequest("Uneti fajl nije u CSV formatu");

                }
                else
                    return BadRequest("Fajl ne postoji");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
        private bool IfFileExists(IFormFile file,string userID)
        {
            if (_context.Files.Where(x => x.userID == userID && x.FileName == file.FileName) != null)
                return true;

            return false;
        }

        [HttpGet("getStatistic")]
        public async Task<IActionResult> getStatistic(string userID)
        {
            try {
                DataModel model = _context.Files.Where(x => x.userID.Equals(userID)).FirstOrDefault();
                if (model != null)
                {
                    if (!RadSaFajlovima.DaLiFajlPostoji(model.FileName))
                        return BadRequest("Fajl ne postoji " + model.FileName);
                    var jsonObject = JsonConvert.SerializeObject(model);
                    var answer = await _iCustomClient.sendData(jsonObject);
                    var statistic = JsonConvert.DeserializeObject<ResponseModel>(answer);

                    if (statistic.Status == 1)
                    {
                        _context.Entry(model).State = EntityState.Deleted;
                        _context.SaveChanges();
                        return BadRequest(statistic.Content);
                    }

                    return Ok(statistic.Content);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        [HttpPost("compare")]
        public async Task<IActionResult> ComparasionBetweenTwoDataSet([FromForm]string userID, [FromForm]string metric)
        {
            //var json = JsonConvert.SerializeObject(param_model);  
            var obj = new
            { 
                userID = userID,
                metric = metric
            };
            var objToJson = JsonConvert.SerializeObject(obj);
            var answer = await _iCustomClient.sendRequestForCompare(objToJson);
           
            var jsonToObject = JsonConvert.DeserializeObject<ResponseModel>(answer);
            if (jsonToObject.Status == 1)
                return BadRequest(jsonToObject.Content);

            return Ok(jsonToObject.Content);

        }
        [HttpPost("getCorrelationMatrix")]
        public async Task<ActionResult<string>> GetCorrelationMatrix([FromForm] string sessionID)
        {
            try
            {
                var obj = new {sessionID = sessionID };
                string dataToSend = JsonConvert.SerializeObject(obj);
                var response = await _iCustomClient.GetCorrelationMatrix(dataToSend);

                ResponseModel answer = JsonConvert.DeserializeObject<ResponseModel>(response);
                if (answer.Status == 1)
                    return BadRequest("Greska");

                //string sendToFront = JsonConvert.SerializeObject(answer.Content);

                return Ok(answer.Content);
                
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }



    }
}
