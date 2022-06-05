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
using Microsoft.Extensions.Options;
using Projekat.Servisi;

namespace Projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KontrolerAutorizacije : ControllerBase
    {
        private readonly MySqlDbContext _context;

        private readonly IConfiguration configuration;
        private readonly MachineLearningClient _client;
        private readonly Servisi.IMailService _mail;
        private readonly MailPodesavanja _settings;

        public KontrolerAutorizacije(IConfiguration configuration, MySqlDbContext context, MachineLearningClient client, Servisi.IMailService mail, IOptions<MailPodesavanja> settings)
        {
            this.configuration = configuration;
            _context = context;
            _client = client;
            _mail = mail;
            _settings = settings.Value;
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
                    var user_id  = _context.Korisnici.FirstOrDefault(x => x.Username == zahtev.Username);
                    if (zahtev.image != null)
                    {
                        korisnik.ProfileImage = RadSaFajlovima.upisiSliku(korisnik.ID,zahtev.image);
                        await _context.SaveChangesAsync();
                    }
                    //List<string> pomLista = new List<string>();
                    //pomLista.Add(zahtev.Email);

                    string url = configuration.GetSection("Front_Server_Config:host").Value + ":" + configuration.GetSection("Front_Server_Config:port").Value;
                    MailPotvrdeRegistracije mail=new MailPotvrdeRegistracije();
                    mail.Name = zahtev.Username;
                    mail.Email = zahtev.Email;
                    mail.UrlZaRegistraciju ="http://"+ url + "/verifikacija?token=" + EmailToken;

                    MailData mailData = new MailData(
                    new List<string> { zahtev.Email },
                    "Potvrda registracije",
                    _mail.GetEmailTemplate("PotvrdaRegistracije", mail));
                    bool sendResult = await _mail.SendAsync(mailData, new CancellationToken());


                    //string url = configuration.GetSection("Front_Server_Config:host").Value +":"+ configuration.GetSection("Front_Server_Config:port").Value;
                    //string tekst = "Kliknite na link za potvrdu registracije:http://"+ url + "/verifikacija?token=" + EmailToken + "</h1>";
                    //MailData poruka = new MailData(pomLista, "Potvrda registracije",body: tekst);
                    //bool result = await _mail.SendAsync(poruka, new CancellationToken());


                    //EmailKontroler.PosaljiEmail("Kliknite na link za potvrdu registracije:http://localhost:4200/verifikacija?token=" + EmailToken, "Potvrda registracije", zahtev.Email, configuration);
                    if (sendResult)
                    {
                        return Ok(new
                        {
                            success = true,
                            data = new
                            {
                                message = "Uspešna registracija"
                            }
                        });
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Došlo je do greške prilikom slanja email-a.");
                    }
                    
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    if (ex.InnerException.Message.Contains("IX_Korisnici_Email"))
                        return BadRequest("Email je već povezan sa drugim nalogom");

                    if (ex.InnerException.Message.Contains("IX_Korisnici_Username"))
                        return BadRequest("Već postoji korisnik sa datim korisničkim imenom-om");


                }
            }
            return BadRequest("Neuspešna registracija");
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
                return BadRequest("Pogrešna šifra");
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
                    return BadRequest("Loš token/ ne postoji");
                Debug.WriteLine(name);
                Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(name)).FirstOrDefault();
                if (korisnik == null)
                    return BadRequest("Dati korisnik ne postoji");
                if (!VerifyPasswordHash(izmene.StariPassword, korisnik.PasswordHash, korisnik.PasswordSalt))
                {
                    return BadRequest("Pogrešna sifra");
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
                        return BadRequest("Već postoji korisnik sa datim username-om");
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
                        return BadRequest("Već postoji korisnik sa datim Email-om");
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
                return Ok("Uspešna izmena naloga");
            }
            return BadRequest("Neuspešna izmena");
            
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
        //pored tokena mora da stigne i nazivfajla koji korisnik unese
        [HttpPost("{token}/save")]
        public async Task<ActionResult<string>> SaveModel([FromForm]string token,[FromForm] string userID, [FromForm]string fileName, [FromForm] string description, [FromForm] string parametars)//[fromform ako zatreba vidi na frontu]
        {
           try
           {
                Debug.WriteLine(fileName);
                Debug.WriteLine(description);
                Debug.WriteLine(parametars);
               string currentUser = ValidateToken(token,configuration);
               if (currentUser.IsNullOrEmpty())
                   return BadRequest("Vaša sesija je istekla!");

               var jsonObject = new {userID = userID,metric = parametars};
               var objectToJson = JsonConvert.SerializeObject(jsonObject);
                //slanje podataka mikroservisu
               var answer = await _client.SaveModel(objectToJson);

               var response = JsonConvert.DeserializeObject<ResponseModel>(answer);
               if (response.Status == 1)
                   return BadRequest("Neuspešno cuvanje modela!");

               Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(currentUser)).FirstOrDefault();
               if (korisnik == null)
                   return BadRequest("Korisnik nije pronadjen!");
               SavedModelsModel savedModel=_context.SavedModels.Where(x=>x.UserID.Equals(korisnik.ID) && x.ModelName.Equals(fileName)).FirstOrDefault();
                if(savedModel!=null)
                {
                    return BadRequest("Model sa datim imenom već postoji!");
                }

               SavedModelsModel saveModel = new SavedModelsModel
               {
                   UserID = korisnik.ID,
                   ModelID =response.Content,//kontent sadrzi modelid koji microservis vraca 
                   DateSaved = DateTime.Now,
                   ModelName = fileName,
                   Description = description
               };

               _context.SavedModels.Add(saveModel);
               await _context.SaveChangesAsync();

               return Ok("Model sačuvan");
               }
           catch (Exception ex)
           {

               return BadRequest(ex);
           }

        }

        [HttpGet("{token}/getAllModels")]
        public async Task<ActionResult<string>> GetSavedModels(string token)
        {
           try
           {
                Debug.WriteLine(token);
               var currentUser = ValidateToken(token, configuration);
               if (currentUser.IsNullOrEmpty())
                   return BadRequest("Greška pri validaciji tokena");

               Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(currentUser)).FirstOrDefault();
               if (korisnik == null)
                   return BadRequest("Korisnik nije pronadjen!");

               List<SavedModelsModel> allSavedModels = new List<SavedModelsModel>();
               allSavedModels = _context.SavedModels.FromSqlRaw("SELECT * FROM savedmodels WHERE UserID = "+korisnik.ID).ToList();//NA FRONT SE SALJE SAMO IME OPIS I DATUM!!!
                string neccessaryData = this.GetNeccessaryDataFromModels(allSavedModels);
               return Ok(neccessaryData);
           }
           catch (Exception ex)
           {

               return BadRequest(ex);
           }
           
        }

        private string GetNeccessaryDataFromModels(List<SavedModelsModel> models)
        {
            List<NecessaryDataModel> necessaryData = new List<NecessaryDataModel>();
            foreach (var model in models)
            {
                necessaryData.Add(new NecessaryDataModel(model.ModelID,model.DateSaved, model.ModelName, model.Description));
            }

            return JsonConvert.SerializeObject(necessaryData);
        }

        [HttpPost("{token}/getmodelbyid")]
        public async Task<ActionResult<string>> GetModelByID([FromForm]string token,[FromForm]string modelID,[FromForm] string userID)
        {
            Debug.WriteLine(modelID);
            var currentUser = ValidateToken(token, this.configuration);
            if (currentUser.IsNullOrEmpty())
                return BadRequest("Pristup odbijen!");

            Korisnik korisnik = _context.Korisnici.Where(x => x.Username.Equals(currentUser)).FirstOrDefault();
            if (korisnik == null)
                return BadRequest("Korisnik nije pronadjen!");

            //var model = _context.SavedModels.FromSqlRaw("SELECT * FROM savedmodels WHERE UserID = " + korisnik.ID + " AND ModelID =\"" + modelID+"\"");

            SavedModelsModel model = (SavedModelsModel)_context.SavedModels.Where(model => model.ModelID == modelID && model.UserID == korisnik.ID).FirstOrDefault();
            if (model == null)
                return BadRequest("Model ne postoji!");

            var jsonObject = new { userID = userID, modelName = modelID };

            string jsonString = JsonConvert.SerializeObject(jsonObject);  
            var answer = await _client.GetParametarsForModel(jsonString);

            var response = JsonConvert.DeserializeObject<ResponseModel>(answer);
            if (response.Status == 1)
                return BadRequest("Doslo je do greske prilikom pronalazenja modela!");

            var obj = new { parametars = response.Content, model = model };

            var dataToSend = JsonConvert.SerializeObject(obj);
            return Ok(dataToSend);
        }
        [HttpPut("updatepassword")]
        public async Task<ActionResult<string>> UpdatePassword([FromForm] string jwt, [FromForm] string oldPassword, [FromForm] string newPassword)
        {
            try
            {
                var currentUser = ValidateToken(jwt, this.configuration);
                Korisnik? user = _context.Korisnici.Where(k => k.Username == currentUser).FirstOrDefault();
                if (user == null)
                    return BadRequest("Korisnik nije pronadjen");
                bool verifyUser = VerifyPasswordHash(oldPassword, user.PasswordHash, user.PasswordSalt);
                if (!verifyUser )
                    return BadRequest("Neispravna lozinka! Pokušajte ponovo");

                CreatePasswordHash(newPassword, out byte[] passwordHash, out byte[] passwordSalt);
                if (passwordSalt == null || passwordHash == null )
                    return BadRequest("Greška pri ažuriranju lozinke");

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;

                await _context.SaveChangesAsync();

                return Ok("Lozinka uspešno ažurirana");



            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete-model")]
        public async Task<ActionResult<string>> DeletePassword([FromForm] string jwt, [FromForm] string modelID)
        {
            try
            {
                var currentUser = ValidateToken(jwt, this.configuration);

                Korisnik? user = _context.Korisnici.Where(k => k.Username == currentUser).FirstOrDefault();

                if (user == null)
                    return BadRequest("Korisnik nije pronadjen");

                SavedModelsModel? model = _context.SavedModels.Where(m => m.ModelID == modelID && m.UserID == user.ID).FirstOrDefault();
                if (model == null)
                    return BadRequest("Model ne postoji");

                _context.SavedModels.Remove(model);
                await _context.SaveChangesAsync();

                return Ok("Model uspešno obrisan");
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
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
