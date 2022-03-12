using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Data;
using MailKit;
using MailKit.Net.Smtp;
using MimeKit;


namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailKontroler : ControllerBase
    {
        private readonly MySqlDbContext _context;

        private readonly IConfiguration configuration;

        public EmailKontroler(IConfiguration configuration, MySqlDbContext context)
        {
            this.configuration = configuration;
            _context = context;
        }



        public static bool PosaljiEmail(string tekstPoruke, string Naslov, string EmailPrimaoca, IConfiguration konfiguracija)
        {
            MimeMessage poruka = new MimeMessage();

            poruka.From.Add(new MailboxAddress("ANNon", konfiguracija.GetSection("EmailKonfiguracija:Email").Value));

            poruka.To.Add(MailboxAddress.Parse(EmailPrimaoca));

            poruka.Subject = Naslov;



            poruka.Body = new TextPart("plain")
            {
                Text = tekstPoruke
                
            };
            
            SmtpClient client = new SmtpClient();

            try
            {
                client.Connect(konfiguracija.GetSection("EmailKonfiguracija:SmtpServer").Value, 465, true);
                client.Authenticate(konfiguracija.GetSection("EmailKonfiguracija:Email").Value, konfiguracija.GetSection("EmailKonfiguracija:Sifra").Value);
                client.Send(poruka);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }

            return false;
        }
    }
}
