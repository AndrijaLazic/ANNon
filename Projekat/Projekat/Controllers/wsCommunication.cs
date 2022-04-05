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
        private readonly ClientWebSocket  socket;
        private readonly WebSocketCustomClient  _customClient;
        private readonly string uri = string.Empty;
        public wsCommunication(IConfiguration configuration, MachineLearningClient client, IHubContext<EpochHub> hub, MySqlDbContext context)
        {
           _configuration = configuration;
           _client = client;
           _hub = hub;
           _context = context;
            _customClient = new WebSocketCustomClient();
            socket = _customClient.newClient();
            uri = _configuration.GetSection("ML_Server_Config:host").Value + ":" + _configuration.GetSection("ML_Server_Config:port").Value;
        }
        
        [HttpPost("{connectionID}")]
        public void Post(string connectionID,string message)
        {
            _hub.Clients.Client(connectionID).SendAsync("sendResults", message);
        }
        //NEKA VRSTA MIDDLEWARE-A KOJA SPAJA SIGNALR 
        [HttpPost("user")]
        public async Task<IActionResult> startTraining([FromForm]string userID,[FromForm] string connectionID)
        {
            if(userID.IsNullOrEmpty())
                return BadRequest();

            using (socket)
            {
                try
                {
                    await socket.ConnectAsync(new Uri("ws://"+uri+"/test/" + userID), CancellationToken.None);
                    while(true)
                    {
                        await _customClient.Send(socket, userID);
                        var ans = await _customClient.Recieve(socket);
                        await _hub.Clients.Client(connectionID).SendAsync("sendResults", ans);
                    }
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);

                }

            }
        }

       
       [HttpGet("getStatistic")]
       public async Task getStatistic([FromForm]string userID,string connectionID)
       {
           DataModel model = _context.Files.Where(x => x.userID.Equals(userID)).FirstOrDefault();
           if (model != null)
           {
               using(socket)
               {
                   try
                   {
                       await socket.ConnectAsync(new Uri("ws://" + uri + "/send/" + userID), CancellationToken.None);
                       while (true)
                       {
                           await _customClient.Send(socket, userID);
                           var ans = await _customClient.Recieve(socket);
                           await _hub.Clients.Client(connectionID).SendAsync("getStats", ans);

                       }
                   }
                   catch (Exception e)
                   {

                       throw;
                   }
               }
           }
       }


       [HttpPost("parametars")]
       public async Task getParametars(ParametarsModel param_model, string userID, string connectionID)
       {
           var json = JsonConvert.SerializeObject(param_model);
           //var answer = await _iCustomClient.sendParametars(json);
           using (socket)
           {
               try
               {
                   await socket.ConnectAsync(new Uri(uri + userID), CancellationToken.None);
                   while (true)
                   {
                       await _customClient.Send(socket, userID);//dodaj parametre kao model = null i onda salji
                       var ans = await _customClient.Recieve(socket);
                       await _hub.Clients.Client(connectionID).SendAsync("getParams", ans);

                   }

               }
               catch (Exception e)
               {

                   throw;
               }
           }

       }
       





    }

}
