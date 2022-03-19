using Microsoft.AspNetCore.Mvc;
using Projekat.Modeli;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Projekat.Data;
using System.Text;
using MySqlConnector;
using MailKit;
using MailKit.Net.Smtp;
using MimeKit;

namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KontrolerAutorizacije : ControllerBase
    {
        private readonly MySqlDbContext _context;

        private readonly IConfiguration configuration;

        public KontrolerAutorizacije(IConfiguration configuration, MySqlDbContext context)
        {
            this.configuration = configuration;
            _context = context;
        }



        [HttpPost("registracija")]
        public async Task<ActionResult<Korisnik>> Registracija(KorisnikRegistracijaDTO zahtev)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    Korisnik korisnik;
                    CreatePasswordHash(zahtev.Password, out byte[] passwordHash, out byte[] passwordSalt);
                    korisnik = new Korisnik();
                    korisnik.Username = zahtev.Username;
                    korisnik.Email = zahtev.Email;
                    korisnik.PasswordHash = passwordHash;
                    korisnik.PasswordSalt = passwordSalt;
                    string EmailToken = CreateToken(korisnik, int.Parse(configuration.GetSection("AppSettings:TrajanjeEmailTokenaUMinutima").Value.ToString()));
                    korisnik.EmailToken = EmailToken;

                    _context.Korisnici.Add(korisnik);
                    await _context.SaveChangesAsync();
                    

                    EmailKontroler.PosaljiEmail("Kliknite na link za potvrdu registracije:https://localhost:7286/api/EmailKontroler/"+ EmailToken, "Potvrda registracije", zahtev.Email, configuration);
                    
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            message= "Uspesna registracija"
                        }
                    });
                }
                catch (Exception ex)
                {

                    if (ex.InnerException.Message.Contains("IX_Korisnici_Email"))
                        return BadRequest("Email je vec povezan sa drugim nalogom");

                    if (ex.InnerException.Message.Contains("IX_Korisnici_Username"))
                        return BadRequest("Vec postoji korisnik sa datim username-om");


                }
            }
            return BadRequest("Neuspesna registracija");
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDTO zahtev)
        {
            var korisnik = _context.Korisnici.Where(x => x.Username.Equals(zahtev.Username)).FirstOrDefault();
            if (korisnik == null)
            {
                return BadRequest("Korisnik sa datim username-om ne postoji");
            }
            else if (!VerifyPasswordHash(zahtev.Password, korisnik.PasswordHash, korisnik.PasswordSalt))
            {
                return BadRequest("Pogresna sifra");
            }
            else if(korisnik.EmailPotvrdjen==false)
            {
                return BadRequest("Email nije potvrdjen,proverite svoju email adresu");
            }

            string token = CreateToken(korisnik, int.Parse(configuration.GetSection("AppSettings:TrajanjeTokenaUMinutima").Value.ToString()));
            return Ok(token);

        }

        
        private string CreateToken(Korisnik korisnik,int trajanjeUMinutima)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("username",korisnik.Username)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(trajanjeUMinutima),
                signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
        /*
        [HttpPost("index")]
        public async Task<ActionResult<string>> validacija(LoginDTO login)
        {
            string? name = ValidateToken(login.Username);
            if (name == null)
                return BadRequest("Los token/ ne postoji");

            return Ok("Sve ok " + name);

        }
        */
        public static string? ValidateToken(string token,IConfiguration konfiguracija)
        {
            if (token == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(konfiguracija.GetSection("AppSettings:Token").Value.ToString());



            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    ClockSkew = TimeSpan.Zero
                },
                out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                var userName = (jwtToken.Claims.First(x => x.Type == "username").Value);

                return userName.ToString();
            }
            catch
            {
                return null;
            }

        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }


        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }


       

    }
}
