using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Data;
using System.IO;
namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FajlKontroler : ControllerBase
    {
        private readonly MySqlDbContext _context;

        private readonly IConfiguration configuration;
        public FajlKontroler(IConfiguration configuration, MySqlDbContext context)
        {
            this.configuration = configuration;
            _context = context;
        }


        [HttpGet("DajFajl")]
        public async Task<ActionResult> DajFajl(string NazivFajla,string imeKorisnika)
        {
            var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi", NazivFajla);
            if (System.IO.File.Exists(pathBuilt))
            {
                var data = System.IO.File.ReadAllBytes(pathBuilt);


                var result = new FileContentResult(data, "application/octet-stream")
                {
                    FileDownloadName = NazivFajla
                    
                };

                return result;
            }
            return Ok("Dati fajl nepostoji");


        }
    }
}
