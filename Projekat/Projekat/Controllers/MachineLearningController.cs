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
        public async Task<IActionResult> UploadFile([FromForm]IFormFile uploadedFile)
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
                            DataModel dataModel = new DataModel();
                            dataModel.FileName = uploadedFile.FileName;
                            dataModel.Putanja = pathBuilt;
                            var jsonObject = JsonConvert.SerializeObject(dataModel);
                            var answer = await _iCustomClient.sendData(jsonObject);

                            string statistic = JsonConvert.DeserializeObject<String>(answer);

                            return Ok(statistic);
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
