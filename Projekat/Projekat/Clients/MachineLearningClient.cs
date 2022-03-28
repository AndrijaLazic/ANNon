using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using Projekat.Modeli;
using System.Net.WebSockets;

namespace Projekat.Clients
{
    public class MachineLearningClient
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private string uri = string.Empty;
        // Constructor
        public MachineLearningClient(HttpClient client,IConfiguration configuration)
        {
            _configuration = configuration;
             uri =configuration.GetSection("ML_Server_Config:http") + configuration.GetSection("ML_Server_Config:host").Value.ToString() + ":" + configuration.GetSection("ML_Server_Config:port").Value.ToString() + "/";
            _client = client;
            _client.BaseAddress = new Uri(uri);
            _client.Timeout = new TimeSpan(0, 0, 30);
            _client.DefaultRequestHeaders.Clear();
        }

        public async Task<String> GetMean()
        {
            // Set the request message
            var request = new HttpRequestMessage(HttpMethod.Get, "/");
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Call API and get the response
            using (var response = await _client.SendAsync(request))
            {
                // Ensure we have a Success Status Code
                response.EnsureSuccessStatusCode();

                // Read Response Content (this will usually be JSON content)
                var content = await response.Content.ReadAsStringAsync();

                // Deserialize the JSON into the C# List<Movie> object and return
                return content;///JsonConvert.DeserializeObject<List<String>>(content);
            }
        } 
        public async Task<string> sendData(string model)
        { 
            var content = new StringContent(model,Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _client.PostAsync(_client.BaseAddress+"send", content);
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> sendParametars(string json_model)
        {
            var content = new StringContent(json_model, Encoding.UTF8, "application/json");
            HttpResponseMessage httpResponse = await _client.PostAsync(_client.BaseAddress + "param", content);
            var result = await httpResponse.Content.ReadAsStringAsync();

            return result;
        }


        public async Task<string> WsServerConnect(string userID)
        {
            using (var socket = new ClientWebSocket())
            {
                try
                { 
                    await socket.ConnectAsync(new Uri("ws://127.0.0.1:8000/test/"+userID), CancellationToken.None);
                    await Send(socket, userID);
                    var res = await Recieve(socket);
                    return res.ToString();

                }
                catch (Exception ex)
                {

                    return ex.Message;

                }
                
            }
        }
        private static async Task Send(ClientWebSocket socket, string userID)
        {
            await socket.SendAsync(Encoding.UTF8.GetBytes(userID), WebSocketMessageType.Text, true, CancellationToken.None);
        }

        private static async Task<WebSocketReceiveResult> Recieve(ClientWebSocket socket)
        {
            var buffer = new ArraySegment<byte>(new byte[1024 * 4]);
            WebSocketReceiveResult result;
            do
            {
                

                using (var ms = new MemoryStream())
                {
                    do
                    {
                        result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                        ms.Write(buffer.Array, buffer.Offset, result.Count);
                    } while (!result.EndOfMessage);

                    if (result.MessageType == WebSocketMessageType.Close)
                        break;

                    ms.Seek(0, SeekOrigin.Begin);
                    
                }
            } while (true);

            return result;


        }
    }
}
