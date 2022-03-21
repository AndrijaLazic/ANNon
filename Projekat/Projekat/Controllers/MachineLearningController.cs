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
                    /*
                    var bytes = await uploadedFile.GetBytes();
                    var hexString = Convert.ToBase64String(bytes);
                    FileDTO sendFile = new FileDTO
                    {
                        FileName = uploadedFile.FileName,
                        file = uploadedFile
                    };
                    //var jsonToSend = JsonConvert.SerializeObject(sendFile);





                    var file = sendFile.file;
                    if (RadSaFajlovima.ProveriAkoJeCsvFajl(file))
                       await RadSaFajlovima.UpisiFajl(file);
                    /*
                   

                    dataModel.FileName = file.FileName;
                   
                    dataModel.file = hexString;
                    */
                    var bytes = await uploadedFile.GetBytes();
                    var hexString = Convert.ToBase64String(bytes);
                    DataModel dataModel = new DataModel();
                    dataModel.FileName = uploadedFile.FileName;
                    dataModel.file = hexString;
                    var jsonObject = JsonConvert.SerializeObject(dataModel); 
                    if (RadSaFajlovima.ProveriAkoJeCsvFajl(uploadedFile))
                        await RadSaFajlovima.UpisiFajl(uploadedFile);
                    var answer = await _iCustomClient.sendData(jsonObject);
                    
                    string statistic = JsonConvert.DeserializeObject<String>(answer);
                    return Ok(statistic);
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
