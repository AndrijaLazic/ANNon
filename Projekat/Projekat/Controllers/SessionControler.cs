using ChoETL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Session;
using System.Text;
using Projekat.Ostalo;
namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionControler : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<ActionResult<string>> uploadData(IFormFile file)
        {
            try
            {
                string pom = (RadSaFajlovima.UcitajFajl("637833769309922112",0,0)).Rows[100][0].ToString();
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
