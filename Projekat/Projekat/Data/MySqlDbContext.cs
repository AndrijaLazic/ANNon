using Microsoft.EntityFrameworkCore;
using Projekat.Modeli;
namespace Projekat.Data
{
    
    public class MySqlDbContext:DbContext
    {
        public MySqlDbContext(DbContextOptions<MySqlDbContext> options):base(options)   {}
        public DbSet<Korisnik> Korisnici { get; set; }


    }
}
