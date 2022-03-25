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
        public MachineLearningController(MachineLearningClient iCustomClient,MySqlDbContext context)
        {
            _iCustomClient = iCustomClient;
            _context = context;
        }

        [HttpGet("mean")]
        public async Task<ActionResult<String>> Test()
        {
            String k = await _iCustomClient.GetMean();
            Console.WriteLine(k.ToString());
            return Ok(k);
        }




        [HttpPost("uploadFile"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile uploadedFile, [FromForm]string userID)
        {

            try
            {

                if (uploadedFile.Length > 0)
                {
                    if (RadSaFajlovima.ProveriAkoJeCsvFajl(uploadedFile))
                    {
                        if (await RadSaFajlovima.UpisiFajl(uploadedFile))
                        {
                            var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi\\" + uploadedFile.FileName);
                            DataModel dataModel = new DataModel
                            {
                                userID = userID,
                                FileName = uploadedFile.FileName,
                                Putanja = pathBuilt
                            };
                            _context.Files.Add(dataModel);
                            await _context.SaveChangesAsync();
                            return Ok(true);
                        }
                        return BadRequest("Greska pri upisivanju fajla");
                    }
                    return BadRequest("Fajl nije csv");

                }
                else
                    return BadRequest("Fajl ne postoji");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }


        [HttpGet("getStatistic")]
        public async Task<IActionResult> getStatistic(string userID)
        {
            DataModel model = _context.Files.Where(x => x.userID.Equals(userID)).FirstOrDefault();
            if (model != null)
            {
                var jsonObject = JsonConvert.SerializeObject(model);
                var answer = await _iCustomClient.sendData(jsonObject);
                string statistic = JsonConvert.DeserializeObject<string>(answer);
                return Ok(statistic);

            }

            return BadRequest();
        }


        [HttpPost("parametars")]
        public async Task<IActionResult> getParametars(ParametarsModel param_model)
        {
            var json = JsonConvert.SerializeObject(param_model);  
            var answer = await _iCustomClient.sendParametars(json);
            if (this.Response.StatusCode != 200)
                return BadRequest("Greska pri prosledjivanju parametara!");

            return Ok("Uspesno prosledjeni parametri");    




        }

        [HttpGet("result")]
        public async Task Get()
        {
            
            //dobijanje informacija iz pythona

            Response.Headers.Add("Content-Type", "text/event-stream");

            string message = "data:" + "" + "\n\n";
            byte[] messageBytes = Encoding.ASCII.GetBytes(message);

            await Response.Body.WriteAsync(messageBytes, 0, messageBytes.Length);  
            await Response.Body.FlushAsync();
        }

    }
}
