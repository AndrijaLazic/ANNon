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



        private DataModel dataModel = new DataModel();
        [HttpPost("uploadFile"),DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file.Length > 0)
            {
                
                dataModel.FileName = file.FileName;

                var bytes = await file.GetBytes();
                var hexString = Convert.ToBase64String(bytes);
                dataModel.file = hexString;
                bool success = await RadSaFajlovima.UpisiFajl(file);

                return Ok(dataModel.file);
            }
            else
                return BadRequest("Fajl ne postoji");

        }
        
        [HttpGet("getStatistic")]
        public async Task<ActionResult<String>> getStatistic()
        {
            var jsonObject = JsonConvert.SerializeObject(dataModel);
            var answer = await _iCustomClient.sendData(jsonObject);
            if (answer != "")
            {

                return Ok(answer);
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

    }
}
