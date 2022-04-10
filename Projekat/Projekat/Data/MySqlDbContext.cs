using Microsoft.EntityFrameworkCore;
using Projekat.Modeli;
namespace Projekat.Data
{
    
    public class MySqlDbContext:DbContext
    {
        public MySqlDbContext(DbContextOptions<MySqlDbContext> options):base(options)   {}
        public DbSet<Korisnik> Korisnici { get; set; }
        public DbSet<DataModel> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DataModel>().HasKey(model => new { model.userID, model.FileName });
        }
    }
}
