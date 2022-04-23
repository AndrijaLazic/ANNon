namespace Projekat.Modeli
{
    public class IzmeneProfilaDTO
    {
        public string token { get; set; }=string.Empty;
        [StringLength(maximumLength: 20, ErrorMessage = "Maksimalna duzina username-a je 20")]
        public string Username { get; set; } = string.Empty;

        [StringLength(maximumLength: 50, ErrorMessage = "Maksimalna duzina je 50")]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "Nije uneta valida Email adresa")]
        public string Email { get; set; } = string.Empty;
        public string? NoviPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nije uneta sifra")]
        public string StariPassword { get; set; } = string.Empty;
        public IFormFile? image { get; set; }
    }
}
