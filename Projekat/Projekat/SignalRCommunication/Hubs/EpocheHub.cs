using Microsoft.AspNetCore.SignalR;

namespace Projekat.SignalRCommunication.Hubs
{
    
    public class EpochHub : Hub
    {
        public async Task SendMessage(string data, string connID) => await Clients.Client(connID).SendAsync(data);

        public string GetConnectionID => Context.ConnectionId;

    }
    
}
