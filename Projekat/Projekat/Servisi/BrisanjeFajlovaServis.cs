using Microsoft.Extensions.Options;
using Projekat.Data;
using Projekat.Modeli;
using Projekat.Ostalo;
using System.Linq;
namespace Projekat.Servisi
{
    public class BrisanjeFajlovaServis : BackgroundService
    {
        private readonly ILogger<BrisanjeFajlovaServis> _logger;
        private HttpClient httpKlijent;
        private readonly IServiceScopeFactory scopeFactory;

        public BrisanjeFajlovaServis(ILogger<BrisanjeFajlovaServis> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            this.scopeFactory = scopeFactory;
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
                
                DateTime trenutnoVreme = DateTime.Now.AddDays(-1);//svi fajlovi stariji od ovog vremena ce biti obisani
               
                using (var scope = scopeFactory.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<MySqlDbContext>();

                    List<DataModel> fajlovi=dbContext.Files.Where(
                        x => x.VremeUploada < trenutnoVreme).ToList();

                    if (fajlovi.Count > 0)
                    {
                        for (var i=0;i<fajlovi.Count;i++)
                        {
                            if (RadSaFajlovima.IzbrisiFajl(fajlovi.ElementAt(i).FileName))
                            {
                                Console.WriteLine("Izbrisan fajl sa imenom-em:" + fajlovi.ElementAt(i).FileName);

                                dbContext.Remove(fajlovi.ElementAt(i));
                            }
                            else
                            {
                                Console.WriteLine("Greska prilikom brisanja fajla "+ fajlovi.ElementAt(i).FileName);
                            }
                            
                        }
                        fajlovi = null;
                        
                        await dbContext.SaveChangesAsync();
                        dbContext = null;
                    }


                }
                //var result = await httpKlijent.PostAsync("https://localhost:7286/api/SessionControler/upload",null);
                //Console.WriteLine(result);
                //if (result.IsSuccessStatusCode)
                //{
                //    _logger.LogInformation("Servis radi:{time}", DateTimeOffset.Now);
                //}
                //else
                //{
                //    _logger.LogInformation("Servis ne radi:{time}", DateTimeOffset.Now);

                //}
                
                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
        }
    }
}
