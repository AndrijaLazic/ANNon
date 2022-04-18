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
            HttpResponseMessage response = await _client.PostAsync(_configuration.GetSection("ML_Server_Config:http").Value + _configuration.GetSection("ML_Server_Config:host").Value + ":" + _configuration.GetSection("ML_Server_Config:port").Value + "/" + "send", content);
            if (await response.Content.ReadAsStringAsync() == "")
                return "";
            var result = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<string>(result);
        }

        public async Task<string> sendRequestForCompare(string userID)
        {
            var content = new StringContent(userID, Encoding.UTF8, "application/json");
            HttpResponseMessage httpResponse = await _client.PostAsync(_configuration.GetSection("ML_Server_Config:http").Value + _configuration.GetSection("ML_Server_Config:host").Value + ":" + _configuration.GetSection("ML_Server_Config:port").Value + "/" + "compare", content);
            var result = await httpResponse.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<string>(result);
        }

    }
}
