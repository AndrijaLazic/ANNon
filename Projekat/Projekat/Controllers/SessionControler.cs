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
using Projekat.Data;

namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionControler : ControllerBase
    {
        private readonly MachineLearningClient _iCustomClient;
        private readonly MySqlDbContext _context;

        public SessionControler(MachineLearningClient iCustomClient, MySqlDbContext context)
        {
            _iCustomClient = iCustomClient;
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<string>> uploadData()
        {
            return Ok(true);
        }

        //[HttpPost("brisiFajlove")]
        //public async Task<ActionResult<string>> brisiFajlove()
        //{
        //    DateTime trenutnoVreme = DateTime.Now.AddDays(-1);//svi fajlovi stariji od ovog vremena ce biti obisani
        //    List<DataModel> fajlovi = _context.Files.Where(
        //                x => x.VremeUploada < trenutnoVreme).ToList();

        //    if (fajlovi.Count > 0)
        //    {
        //        for (var i = 0; i < fajlovi.Count; i++)
        //        {
        //            if (RadSaFajlovima.IzbrisiFajl(fajlovi.ElementAt(i).FileName))
        //            {
        //                Console.WriteLine("Izbrisan fajl sa imenom-em:" + fajlovi.ElementAt(i).FileName);

        //                _context.Remove(fajlovi.ElementAt(i));
        //            }
        //            else
        //            {
        //                Console.WriteLine("Greska prilikom brisanja fajla " + fajlovi.ElementAt(i).FileName);
        //            }

        //        }
        //        fajlovi = null;
        //        await _context.SaveChangesAsync();
        //    }

        //    return Ok(true);
        //}
    }
}
