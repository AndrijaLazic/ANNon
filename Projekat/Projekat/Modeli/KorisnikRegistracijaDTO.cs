namespace Projekat.Modeli
{
    public class KorisnikRegistracijaDTO
    {
        [Required(ErrorMessage = "Nije unet username")]
        [StringLength(maximumLength: 20, ErrorMessage = "Maksimalna duzina username-a je 20")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nije unet Email")]
        [StringLength(maximumLength: 50, ErrorMessage = "Maksimalna duzina je 50")]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "Nije uneta valida Email adresa")]
        public string Email { get; set; } = string.Empty;


        [Required(ErrorMessage = "Nije uneta sifra")]
        public string Password { get; set; } = string.Empty;

        public IFormFile? image { get; set; }

    }
}
