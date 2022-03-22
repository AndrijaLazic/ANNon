using ChoETL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Session;
using System.Text;
using Projekat.Ostalo;
using System.Data;
using Projekat.Clients;
using Newtonsoft.Json;
using Projekat.Modeli;

namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionControler : ControllerBase
    {
        private readonly MachineLearningClient _iCustomClient;
        public SessionControler(MachineLearningClient iCustomClient)
        {
            _iCustomClient = iCustomClient;
        }
        [HttpPost("upload")]
        public async Task<ActionResult<string>> uploadData(IFormFile file)
        {
            try
            {

                if (file.Length > 0)
                {
                    if (RadSaFajlovima.ProveriAkoJeCsvFajl(file))
                    {
                        if (await RadSaFajlovima.UpisiFajl(file))
                        {
                            var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi\\" + file.FileName);
                            DataModel dataModel = new DataModel();
                            dataModel.FileName = file.FileName;
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


            try
            {
                string pom = (RadSaFajlovima.UcitajFajl("637833769309922112",20,1)).Rows.Count.ToString();
                foreach(DataRow red in (RadSaFajlovima.UcitajFajl("637833769309922112", 20, 1)).Rows){
                    Console.WriteLine(red[0]);
                }
                if (!string.IsNullOrEmpty(pom))
                {
                    return Ok(pom);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                if (ex.Message.Contains("Could not find file"))
                    return BadRequest("Dati fajl ne postoji");
                
                
                return BadRequest("Doslo je do greske pri ucitavanju fajla");
            }
            
            if (file.Length == 0)
            {
                return BadRequest("bad");
            }
            string fileName = file.FileName;
            
            await using var stream = file.OpenReadStream();


            var reader = new StreamReader(stream);
            var text = await reader.ReadToEndAsync();

            StringBuilder sb = new StringBuilder();
            using (var p = ChoCSVReader.LoadText(text)
                .WithFirstLineHeader()
                )
            {
                using (var w = new ChoJSONWriter(sb))
                    w.Write(p);
            }

            Console.WriteLine(sb.ToString());

            return Ok(fileName);
        }
    }
}
