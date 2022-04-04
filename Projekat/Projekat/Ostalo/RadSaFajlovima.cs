using System.Linq;
using CsvHelper;
using System.Globalization;
using System.IO;
using System.Data;
using Newtonsoft.Json;
using CsvHelper.Configuration;

namespace Projekat.Ostalo
{
    public class RadSaFajlovima
    {
        public static bool ProveriAkoJeCsvFajl(IFormFile fajl)
        {
            var extension = "." + fajl.FileName.Split('.')[fajl.FileName.Split('.').Length - 1];
            return (extension == ".xlsx" || extension == ".xls" || extension == ".csv");
        }

        public static bool DaLiFajlPostoji(string NazivFajla)
        {
            var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi", NazivFajla);

            if (System.IO.File.Exists(pathBuilt))
            {
                return true;
            }
            return false;
        }

        public static async Task<string> UpisiFajl(IFormFile fajl)
        {
            string imeFajla;
            try
            {
                var extension = "." + fajl.FileName.Split('.')[fajl.FileName.Split('.').Length - 1];
                imeFajla = fajl.FileName;
     
                imeFajla = System.Text.RegularExpressions.Regex.Replace(imeFajla, @"\s+", " ").Trim(); // convert multiple spaces into one space  
                imeFajla = System.Text.RegularExpressions.Regex.Replace(imeFajla, @"\s", "_"); // //Replace spaces by dashes

                var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi");

                if (!Directory.Exists(pathBuilt))
                {
                    Directory.CreateDirectory(pathBuilt);
                }

                var path = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi",imeFajla);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await fajl.CopyToAsync(stream);
                }
            }
            catch (Exception e)
            {
                return null;
            }

            return imeFajla;
        }

        public static DataTable UcitajFajl(string imeFajla)
        {
            var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi\\" + imeFajla);
          
            using (var streamReader = new StreamReader(pathBuilt))
            {

                using (var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture))
                {
                    var records = new List<dynamic>();
                    csvReader.Read();
                    records.Add(csvReader.GetRecord<dynamic>());
                    while (csvReader.Read())
                    {
                        records.Add(csvReader.GetRecord<dynamic>());
                    }

                    var json = JsonConvert.SerializeObject(records);
                    DataTable dataTable = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
                    return dataTable;
                }
            }

            return null;
        }
        public static DataTable UcitajFajl(string imeFajla, int BrojRedova, int RedniBrojStrane)
        {
            
            var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\csvFajlovi\\" + imeFajla);
            using (var reader = new StreamReader(pathBuilt))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                int trenutniRed = 0;
                int pocetniRed = (RedniBrojStrane - 1) * BrojRedova;
                int poslednjiRed = RedniBrojStrane * BrojRedova;
                var records = new List<dynamic>();
                string json;
                DataTable dataTable;
                csv.Read();
                records.Add(csv.GetRecord<dynamic>());

                while (csv.Read())
                {
                    if (trenutniRed<poslednjiRed && trenutniRed>=pocetniRed)
                    {
                        records.Add(csv.GetRecord<dynamic>());
                    }
                    else if (trenutniRed > poslednjiRed)
                    {
                        json = JsonConvert.SerializeObject(records);
                        dataTable = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
                        return dataTable;
                    }
                    trenutniRed++;
                }

                json = JsonConvert.SerializeObject(records);
                dataTable = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));

                return dataTable;
            }
            return null;
        }
        

    }
}
