using Projekat.Modeli;
using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;
namespace Projekat.Clients
{
    public class WebSocketCustomClient
    {
        public ClientWebSocket newClient()
        {
            return new ClientWebSocket();
        }

        public async Task Send(ClientWebSocket socket, string userID)
        {
            await socket.SendAsync(Encoding.UTF8.GetBytes(userID), WebSocketMessageType.Text, true, CancellationToken.None);
        }
        public async Task Send(ClientWebSocket socket, ParametriDTO model)
        {

            var data_to_send = JsonConvert.SerializeObject(model);
            //spakuj u buffer userid i 
            await socket.SendAsync(Encoding.UTF8.GetBytes(data_to_send), WebSocketMessageType.Text, true, CancellationToken.None);
        }

        public async Task<string> Recieve(ClientWebSocket socket)
        {
            var buffer = new ArraySegment<byte>(new byte[1024 * 4]);
            WebSocketReceiveResult result;
            using (var ms = new MemoryStream())
            {
                do
                {
                    result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                } while (!result.EndOfMessage);


                ms.Seek(0, SeekOrigin.Begin);

            }
            //POGLEDAJ KAKO DA SE VRATI REZULTAT
            return Encoding.UTF8.GetString(buffer.ToArray(), 0, result.Count);
        }
    }
}
