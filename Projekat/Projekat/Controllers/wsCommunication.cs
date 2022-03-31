using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Projekat.Clients;
using Projekat.Data;
using Projekat.SignalRCommunication.Hubs;
using Projekat.TimeFeatures;
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
        
        [HttpPost("{connectionID}")]
        public void Post(string connectionID,string message)
        {
            _hub.Clients.Client(connectionID).SendAsync("sendResults", message);
        }
        //NEKA VRSTA MIDDLEWARE-A KOJA SPAJA SIGNALR 
        [HttpPost("user")]
        public async Task<IActionResult> getUserID(string userID, string connectionID)
        {
            if(userID.IsNullOrEmpty())
                return BadRequest();

            var ans = await _client.WsServerConnect(userID);

            await _hub.Clients.Client(connectionID).SendAsync("sendResults", ans);
            return Ok();
        }
        [HttpGet("wsrequest")]
        public async Task<IActionResult> Get()
        {
            var timeManager = new TimerManager(() => _hub.Clients.All.SendAsync("transferchartdata", DataManager.getData()));
            return Ok(new { Message = "Request Completed" });


        }





    }
        
}
