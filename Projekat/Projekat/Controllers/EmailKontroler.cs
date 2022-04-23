using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Data;
using MailKit;
using MailKit.Net.Smtp;
using MimeKit;
using Projekat.Modeli;
using System.IdentityModel.Tokens.Jwt;

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

        [HttpGet("{EmailToken}")]
        public async Task<IActionResult> PotvrdiEmail(string EmailToken)
        {

            if (KontrolerAutorizacije.ValidateToken(EmailToken, this.configuration) != null)
            {
                try
                {
                    var handler = new JwtSecurityTokenHandler();
                    var token = handler.ReadJwtToken(EmailToken);
                    string username=token.Claims.First(claim => claim.Type == "username").Value;

                    Korisnik korisnik=_context.Korisnici.Where(x => x.Username.Equals(username)).FirstOrDefault();
                    korisnik.EmailPotvrdjen = true;
                    korisnik.Email=token.Claims.First(claim => claim.Type == "email").Value;
                    korisnik.EmailToken = EmailToken;
                    await _context.SaveChangesAsync();
                    //return Ok("Uspesno verifikovana Email adresa za korisnika " + korisnik.Username);
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            message = "Uspesno verifikovana Email adresa za korisnika " + korisnik.Username
                        }
                    });
                }
                catch (Exception ex)
                {
                    return BadRequest("Email nije verifikovan");
                }
            }

            return BadRequest("Email token nije validan");
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
