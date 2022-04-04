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
        public async Task<ActionResult<string>> uploadData(string poruka)
        {
            //try
            //{
            //    string pom = (RadSaFajlovima.UcitajFajl("637833769309922112", 20, 1)).Rows.Count.ToString();
            //    foreach (DataRow red in (RadSaFajlovima.UcitajFajl("637833769309922112", 20, 1)).Rows)
            //    {
            //        Console.WriteLine(red[0]);
            //    }
            //    if (!string.IsNullOrEmpty(pom))
            //    {
            //        return Ok(pom);
            //    }
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine(ex.Message);
            //    if (ex.Message.Contains("Could not find file"))
            //        return BadRequest("Dati fajl ne postoji");


            //    return BadRequest("Doslo je do greske pri ucitavanju fajla");
            //}

            return Ok(poruka);
        }
    }
}
