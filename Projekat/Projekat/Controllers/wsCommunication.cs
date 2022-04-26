using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Projekat.Clients;
using Projekat.Data;
using Projekat.Modeli;
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
        private readonly MySqlDbContext _context;
        private ClientWebSocket  socket;
        private readonly WebSocketCustomClient  _customClient;
        private readonly string uri = string.Empty;
        public wsCommunication(IConfiguration configuration, MachineLearningClient client, IHubContext<EpochHub> hub, MySqlDbContext context)
        {
           _configuration = configuration;
           _client = client;
           _hub = hub;
           _context = context;
            _customClient = new WebSocketCustomClient();
            uri = _configuration.GetSection("ML_Server_Config:host").Value + ":" + _configuration.GetSection("ML_Server_Config:port").Value;
        }
        
        //NEKA VRSTA MIDDLEWARE-A KOJA SPAJA SIGNALR 
        [HttpPost("user")]
        public async Task<IActionResult> startTraining([FromForm]string userID,[FromForm] string connectionID,[FromForm] string parametri)
        {
            if(userID.IsNullOrEmpty())
                return BadRequest();
            var result = JsonConvert.DeserializeObject<ParametriDTO>(parametri);
            using (socket = _customClient.newClient())
            {
                try
                {
                    await socket.ConnectAsync(new Uri("ws://"+uri+"/test/" + userID), CancellationToken.None);
                    await _customClient.Send(socket, parametri);
                    while (true)
                    {
                        
                        var ans = await _customClient.Recieve(socket);
                        await _hub.Clients.Client(connectionID).SendAsync("sendResults", ans);
                        await _customClient.Send(socket, userID);
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }

            }
        }
    }

}
