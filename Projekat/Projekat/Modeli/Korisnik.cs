using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Projekat.Modeli
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Username), IsUnique = true)]

    public class Korisnik
    {
        public int ID { get; set; }


        [StringLength(maximumLength: 20)]
        public string Username { get; set; } = string.Empty;

        [StringLength(maximumLength: 50)]
        public string Email { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; }

        public byte[] PasswordSalt { get; set; }


    }
}
