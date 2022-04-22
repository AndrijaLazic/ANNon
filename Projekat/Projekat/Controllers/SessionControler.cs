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
        public async Task<ActionResult<string>> uploadData()
        {
            return Ok(true);
        }
    }
}
