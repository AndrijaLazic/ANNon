using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Projekat.Clients;
using Projekat.SignalRCommunication.Hubs;
using System.Net.WebSockets;
using System.Text;
using WebSocketSharp;
using WebSocketSharp.Server;


namespace Projekat.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class wsCommunication : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly MachineLearningClient _client;
        private readonly IHubContext<EpochHub> _hub;
        public wsCommunication(IConfiguration configuration, MachineLearningClient client, IHubContext<EpochHub> hub)
        {
           _configuration = configuration;
            _client = client;
            _hub = hub;
          
                
        }
        
        [HttpGet("wsrequest")]
        public async Task<IActionResult> Get()
        {
            return Ok();

            //var res = await _client.WsServerConnect(userID);
            //return Ok(res);
            /*
            if(HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                _client.WsServerConnect(userID);
                
            }
            else
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            */
        }
        
       
        
        
        
    }
        
}
