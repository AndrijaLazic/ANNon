namespace Projekat.Ostalo
{
    public class RadSaFajlovima
    {
        public static bool ProveriAkoJeExcelFajl(IFormFile fajl)
        {
            var extension = "." + fajl.FileName.Split('.')[fajl.FileName.Split('.').Length - 1];
            return (extension == ".xlsx" || extension == ".xls"); // Change the extension based on your need
        }

        public static async Task<bool> UpisiFajl(IFormFile fajl)
        {
            bool uspesnoCuvanjeFajla = false;
            string imeFajla;
            try
            {
                var extension = "." + fajl.FileName.Split('.')[fajl.FileName.Split('.').Length - 1];
                imeFajla = DateTime.Now.Ticks + extension; 

                var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi");

                if (!Directory.Exists(pathBuilt))
                {
                    Directory.CreateDirectory(pathBuilt);
                }

                var path = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi",
                   imeFajla);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await fajl.CopyToAsync(stream);
                }

                uspesnoCuvanjeFajla = true;
            }
            catch (Exception e)
            {
                
            }

            return uspesnoCuvanjeFajla;
        }
    }
}
