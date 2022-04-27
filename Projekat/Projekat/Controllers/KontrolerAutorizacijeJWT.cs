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
using Projekat.Ostalo;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Projekat.Clients;
using Newtonsoft.Json;
namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KontrolerAutorizacije : ControllerBase
    {
        private readonly MySqlDbContext _context;

        private readonly IConfiguration configuration;
        private readonly MachineLearningClient _client;
        public KontrolerAutorizacije(IConfiguration configuration, MySqlDbContext context, MachineLearningClient client)
        {
            this.configuration = configuration;
            _context = context;
            _client = client;
        }



        [HttpPost("registracija")]
        public async Task<ActionResult<Korisnik>> Registracija([FromForm] KorisnikRegistracijaDTO zahtev)
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
                    korisnik.EmailToken =EmailToken;
                    korisnik.EmailPotvrdjen = false;
                    korisnik.ProfileImage = "";
                    
                    _context.Korisnici.Add(korisnik);
                    await _context.SaveChangesAsync();
                    var user_id = _context.Korisnici.FirstOrDefault(x => x.Username == zahtev.Username);
                    if (zahtev.image != null)
                    {
                        korisnik.ProfileImage = RadSaFajlovima.upisiSliku(korisnik.ID,zahtev.image);
                        await _context.SaveChangesAsync();
                    }


                    EmailKontroler.PosaljiEmail("Kliknite na link za potvrdu registracije:http://localhost:4200/verifikacija?token=" + EmailToken, "Potvrda registracije", zahtev.Email, configuration);

                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            message = "Uspesna registracija"
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
            else if (korisnik.EmailPotvrdjen == false)
            {
                return BadRequest("Email nije potvrdjen,proverite svoju email adresu");
            }

            string token = CreateToken(korisnik, int.Parse(configuration.GetSection("AppSettings:TrajanjeTokenaUMinutima").Value.ToString()));
            return Ok(token);

        }
        
        [HttpPost("IzmenaProfila")]
        public async Task<ActionResult<string>> IzmenaProfila([FromForm]IzmeneProfilaDTO izmene)
        {
            Debug.WriteLine(izmene.token);
            if (ModelState.IsValid)
            {
                string? name = ValidateToken(izmene.token, this.configuration);
                if (name == null)
                    return BadRequest("Los token/ ne postoji");
                Debug.WriteLine(name);
                Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(name)).FirstOrDefault();
                if (korisnik == null)
                    return BadRequest("Dati korisnik ne postoji");
                if (!VerifyPasswordHash(izmene.StariPassword, korisnik.PasswordHash, korisnik.PasswordSalt))
                {
                    return BadRequest("Pogresna sifra");
                }

                Korisnik revertKorisnik = new Korisnik();
                revertKorisnik.ProfileImage = korisnik.ProfileImage;
                revertKorisnik.Username = korisnik.Username;
                revertKorisnik.PasswordHash = korisnik.PasswordHash;
                revertKorisnik.PasswordSalt= korisnik.PasswordSalt;
                revertKorisnik.Email = korisnik.Email;

                if (!string.IsNullOrEmpty(izmene.Username))
                {
                    Korisnik korisnik2 = _context.Korisnici.Where(x => x.Username.Equals(izmene.Username)).FirstOrDefault();
                    if (korisnik2 != null && korisnik.ID!=korisnik2.ID)
                    {
                        korisnik = revertKorisnik;
                        return BadRequest("Vec postoji korisnik sa datim username-om");
                    }
                    if(korisnik.Username!=izmene.Username)
                    {
                        korisnik.Username = izmene.Username;
                    }
                    
                }
                if (!string.IsNullOrEmpty(izmene.NoviPassword))
                {
                    CreatePasswordHash(izmene.NoviPassword, out byte[] passwordHash, out byte[] passwordSalt);
                    korisnik.PasswordSalt = passwordSalt;
                    korisnik.PasswordHash= passwordHash;
                }
                if (!string.IsNullOrEmpty(izmene.Email))
                {
                    Korisnik korisnik2 = _context.Korisnici.Where(x => x.Email.Equals(izmene.Email)).FirstOrDefault();
                    if (korisnik2 != null && korisnik.ID != korisnik2.ID)
                    {
                        korisnik = revertKorisnik;
                        return BadRequest("Vec postoji korisnik sa datim Email-om");
                    }
                    if(korisnik.Email!=izmene.Email)
                    {
                        var pomocna = korisnik.Email;
                        korisnik.Email = izmene.Email;
                        string EmailToken = CreateToken(korisnik, int.Parse(configuration.GetSection("AppSettings:TrajanjeEmailTokenaUMinutima").Value.ToString()));
                        korisnik.Email = pomocna;
                        EmailKontroler.PosaljiEmail("Kliknite na link za potvrdu promene email adrese:http://localhost:4200/verifikacija?token=" + EmailToken, "Potvrda promene email-a", izmene.Email, configuration);
                    }
                    
                }
                if(izmene.image!=null)
                {
                    if(korisnik.ProfileImage!="")
                    {

                        System.IO.File.Delete(korisnik.ProfileImage);
                        
                    }
                    
                    korisnik.ProfileImage = RadSaFajlovima.upisiSliku(korisnik.ID,izmene.image);
                }
                await _context.SaveChangesAsync();
                return Ok("Uspesna izmena naloga");
            }
            return BadRequest("Neuspesna izmena");
            
        }
        [HttpGet("{username}/dajsliku")]
        public async Task<ActionResult<dynamic>> getImage(string username)
        {
            //model state valid
            Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(username)).FirstOrDefault();
            if(korisnik==null || korisnik.ProfileImage=="" || korisnik.ProfileImage==null)
            {
                return BadRequest();
            }
        
            Byte[] image = System.IO.File.ReadAllBytes(korisnik.ProfileImage);
            return File(image, "image/jpeg");
        }

        private string CreateToken(Korisnik korisnik, int trajanjeUMinutima)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("username",korisnik.Username),
                new Claim("email",korisnik.Email)
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
        public static string? ValidateToken(string token, IConfiguration konfiguracija)
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
        ////[Authorize]
        //[HttpPost("{token}/save")]
        //public async Task<ActionResult<string>> validate(string token)
        //{
        //    try
        //    {
        //        string currentUser = ValidateToken(token,configuration);
        //        if (currentUser.IsNullOrEmpty())
        //            return BadRequest("Vasa sesija je istekla!");

        //        var jsonObject = new {userID = currentUser,metric = "prazno"};//promeni u py delu da se ne salje ovaj model nego samo UID
        //        var objectToJson = JsonConvert.SerializeObject(jsonObject);
        //        var answer = await _client.SaveModel(objectToJson);

        //        var response = JsonConvert.DeserializeObject<ResponseModel>(answer);
        //        if (response.Status == 1)
        //            return BadRequest("Neuspesno cuvanje modela!");

        //        Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(currentUser)).FirstOrDefault();
        //        if (korisnik == null)
        //            return BadRequest("Korisnik nije pronadjen!");

        //        SavedModelsModel saveModel = new SavedModelsModel
        //        {
        //            UserID = korisnik.ID,
        //            ModelID = "model",
        //            DateSaved = DateTime.Now,
        //            ModelName = "imeModela"
        //        };

        //        _context.SavedModels.Add(saveModel);
        //        await _context.SaveChangesAsync();

        //        return Ok("Model sacuvan");
        //        }
        //    catch (Exception ex)
        //    {

        //        return BadRequest(ex);
        //    }

        //}

        //[HttpGet("{token}/getAllModels")]
        //public async Task<ActionResult<string>> GetSavedModels(string token)
        //{
        //    try
        //    {
        //        var currentUser = ValidateToken(token, configuration);
        //        if (currentUser.IsNullOrEmpty())
        //            return BadRequest("Greska pri validaciji tokena");

        //        Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(currentUser)).FirstOrDefault();
        //        if (korisnik == null)
        //            return BadRequest("Korisnik ne postoji u bazi!");

        //        List<SavedModelsModel> allSavedModels = new List<SavedModelsModel>();
        //        allSavedModels = _context.SavedModels.FromSqlRaw("SELECT * FROM savedmodels WHERE UserID = "+korisnik.ID).ToList();
        //        var modelsToJSON = JsonConvert.SerializeObject(allSavedModels);
        //        return Ok(modelsToJSON);
        //    }
        //    catch (Exception ex)
        //    {

        //        return BadRequest(ex);
        //    }
           
        //}
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
