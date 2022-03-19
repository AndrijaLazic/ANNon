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
        public MachineLearningController(MachineLearningClient iCustomClient)
        {
            _iCustomClient = iCustomClient;
        }

        [HttpGet("mean")]
        public async Task<ActionResult<String>> Test()
        {
            String k = await _iCustomClient.GetMean();
            Console.WriteLine(k.ToString());
            return Ok(k);
        }



        
        [HttpPost("uploadFile"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile()
        {
            try
            {
                //error ukoliko se vise filova ucitava
                var file = Request.Form.Files[0];


                if (file.Length > 0)
                {

                    if (RadSaFajlovima.ProveriAkoJeCsvFajl(file))
                        RadSaFajlovima.UpisiFajl(file);

                    DataModel dataModel = new DataModel();

                    dataModel.FileName = file.FileName;
                    var bytes = await file.GetBytes();
                    var hexString = Convert.ToBase64String(bytes);
                    dataModel.file = hexString;

                    var jsonObject = JsonConvert.SerializeObject(dataModel);
                    dataModel.Statistic = await _iCustomClient.sendData(jsonObject);
                    return Ok(dataModel);
                }
                else
                    return BadRequest("Fajl ne postoji");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
           
        }
        //mora drugi nacin za dobijanje statistike ne moze globalna promenljiva
        
        
        [HttpPost("parametars")]
        public async Task<IActionResult> getParametars(ParametarsModel param_model)
        {
            var json = JsonConvert.SerializeObject(param_model);  
            var answer = await _iCustomClient.sendParametars(json);
            if (this.Response.StatusCode != 200)
                return BadRequest("Greska pri prosledjivanju parametara!");

            return Ok("Uspesno prosledjeni parametri");    




        }

    }
}
