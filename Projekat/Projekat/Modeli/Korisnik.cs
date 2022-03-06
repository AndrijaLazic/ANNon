using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Projekat.Modeli
{
    [Index(nameof(Email), nameof(Username), IsUnique =true)]
    public class Korisnik
    {
        public int ID { get; set; }

        [Required(ErrorMessage ="Nije uneto ime")]
        [StringLength(maximumLength:30)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nije unet Email")]
        [StringLength(maximumLength: 100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;


        [Required(ErrorMessage = "Nije uneta sifra")]
        public byte[] PasswordHash { get; set; }
        [Required(ErrorMessage = "Nije uneta sifra")]
        public byte[] PasswordSalt { get; set; }


    }
}
