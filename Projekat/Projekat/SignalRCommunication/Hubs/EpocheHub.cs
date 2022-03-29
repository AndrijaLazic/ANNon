using Microsoft.AspNetCore.SignalR;

namespace Projekat.SignalRCommunication.Hubs
{
    
    public class EpochHub : Hub
    {
        
        public override Task OnConnectedAsync()
        {
            var connectionID = Context.ConnectionId;
            Clients.Client(connectionID).SendAsync("getConnectionID", connectionID);
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
        public async Task SendResults(string data, string connectionID)
        {
            Clients.Client(connectionID).SendAsync("getTrainingResults", data); 
        }

        
    }
    
}
