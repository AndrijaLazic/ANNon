using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Modeli;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Projekat.Data;
using System.Text;
using System.Text.RegularExpressions;

namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KontrolerAutorizacije : ControllerBase
    {
        private readonly MySqlDbContext _context;
        
        private readonly IConfiguration configuration;

        public KontrolerAutorizacije(IConfiguration configuration,MySqlDbContext context)
        {
            this.configuration = configuration;
            _context = context;
        }



        [HttpPost("registacija")]
        public async Task<ActionResult<Korisnik>> Registracija(KorisnikRegistracijaDTO zahtev)
        {
            Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(zahtev.Username)).FirstOrDefault();
            
            if(korisnik != null)
            {
                return BadRequest("korisnik sa datim username-om vec postoji");
            }
            if (!emailValidation(zahtev.Email))
                return BadRequest("Unesite ispravnu email adresu");
            korisnik = _context.Korisnici.Where(x => x.Email.Equals(zahtev.Email)).FirstOrDefault();

            if (korisnik != null)
            {
                return BadRequest("korisnik sa datim Email-om vec postoji");
            }


            CreatePasswordHash(zahtev.Password, out byte[] passwordHash, out byte[] passwordSalt);
            korisnik = new Korisnik();
            korisnik.Username = zahtev.Username;
            korisnik.Email= zahtev.Email;
            korisnik.PasswordHash = passwordHash;
            korisnik.PasswordSalt = passwordSalt;

            _context.Korisnici.Add(korisnik);
            await _context.SaveChangesAsync();
            Console.WriteLine(korisnik);

            return Ok("Uspesna registracija");
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDTO zahtev)
        {
            var korisnik = _context.Korisnici.Where(x => x.Username.Equals(zahtev.Username)).FirstOrDefault();
            if (korisnik == null)
            {
                return BadRequest("Korisnik sa datim username-om ne postoji");
            }
            if (!VerifyPasswordHash(zahtev.Password, korisnik.PasswordHash, korisnik.PasswordSalt))
            {
                return BadRequest("Pogresna sifra");
            }

            string token = CreateToken(korisnik);
            return Ok(token);

        }


        private string CreateToken(Korisnik korisnik)
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
                expires: DateTime.Now.AddMinutes(int.Parse(configuration.GetSection("AppSettings:TrajanjeTokenaUMinutima").Value.ToString())),
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
        private string? ValidateToken(string token)
        {
            if (token == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration.GetSection("AppSettings:Token").Value.ToString());



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
        private bool emailValidation(string email)
        {
            bool valid = false;
            Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");

            if ((regex.Match(email)).Success)
                valid = true;

            return valid;
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
