using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Text;
using WebSocketSharp.Server;

namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class wsCommunication : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public wsCommunication(IConfiguration configuration)
        {
           _configuration = configuration;
        }
        
        [HttpGet("send")]
        public async Task<IActionResult> Get(string userID)
        {
            //NAPRAVI SERVER KOJIM CE KLIJENT SA FRONTA DA SE KONEKTUJE NA NJEGA
            //POZOVI FJU IZ MLCLIENTA KOJIM CE OVAJ SERVER DA POSTANE KLIJENT PY SERVERU I DA SE KONEKTUJE NA NJEGA
            //IMA SEND RECIEVE METODE KOJE SE POZIVAJU ZA KOMUNIKACIJU
            WebSocketServer server = new WebSocketServer("");
            server.Start();
            
            if (this.Response.StatusCode == 200)
                return Ok(server.Address);
            server.Stop();
            return BadRequest();
        }
        
       
        
        
        
    }
        
}
