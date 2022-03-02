using Microsoft.EntityFrameworkCore;

namespace WebApplication7.Models
{
    public class DetaljiPlacanjaContext:DbContext
    {
        public DetaljiPlacanjaContext(DbContextOptions<DetaljiPlacanjaContext> options):base(options)
        {

        }
        public DbSet<DetaljiPlacanja> PaymentDetails { get; set; }
    }
}
