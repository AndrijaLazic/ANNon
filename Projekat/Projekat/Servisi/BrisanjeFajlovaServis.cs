namespace Projekat.Servisi
{
    public class BrisanjeFajlovaServis : BackgroundService
    {
        private readonly ILogger<BrisanjeFajlovaServis> _logger;
        private HttpClient httpKlijent;
        public BrisanjeFajlovaServis(ILogger<BrisanjeFajlovaServis> logger)
        {
            _logger = logger;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            httpKlijent=new HttpClient();
            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            httpKlijent.Dispose();
            return base.StopAsync(cancellationToken);
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var result = await httpKlijent.GetAsync("https://www.iamtimcorey.com");
                if (result.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Servis radi:{time}", DateTimeOffset.Now);
                }
                else
                {
                    _logger.LogInformation("Servis ne radi:{time}", DateTimeOffset.Now);

                }
                
                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}
