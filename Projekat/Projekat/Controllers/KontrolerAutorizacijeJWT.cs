using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Modeli;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Projekat.Data;

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

        


        private string CreateToken(Korisnik korisnik)
        {
           

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,korisnik.Username)
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
