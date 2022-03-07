using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Projekat.Clients
{
    public class MachineLearningClient
    {
        private readonly HttpClient _client;

        // Constructor
        public MachineLearningClient(HttpClient client)
        {
            _client = client;
            _client.BaseAddress = new Uri("http://127.0.0.1:8000/");
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
    }
}
