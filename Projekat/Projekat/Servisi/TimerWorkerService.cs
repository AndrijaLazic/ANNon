namespace Projekat.Servisi
{
    public class TimerWorkerService : IHostedService,IDisposable
    {
        private readonly ILogger _logger;
        private Timer timer;
        public TimerWorkerService(ILogger<TimerWorkerService> logger)
        {
            this._logger = logger;
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            
            throw new NotImplementedException();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
