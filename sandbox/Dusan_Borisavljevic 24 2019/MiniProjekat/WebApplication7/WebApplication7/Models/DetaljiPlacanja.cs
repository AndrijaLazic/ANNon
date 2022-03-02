using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication7.Models
{
    public class DetaljiPlacanja
    {
        [Key]
        public int idkartice { get; set; }
        [Column(TypeName ="nvarchar(100)")]
        public string ime_vlasnika_kartice { get; set; }
        [Column(TypeName = "nvarchar(16)")]
        public string broj_kartice { get; set; }
        [Column(TypeName = "nvarchar(5)")]
        public string datum_do_kad_vazi { get; set; }
        [Column(TypeName = "nvarchar(3)")]
        public string sigurnosni_kod { get; set; }
    }
}
