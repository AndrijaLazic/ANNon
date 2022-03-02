using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication7.Models;

namespace WebApplication7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetaljiPlacanjaController : ControllerBase
    {
        private readonly DetaljiPlacanjaContext _context;

        public DetaljiPlacanjaController(DetaljiPlacanjaContext context)
        {
            _context = context;
        }

        // GET: api/DetaljiPlacanja
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetaljiPlacanja>>> GetPaymentDetails()
        {
            return await _context.PaymentDetails.ToListAsync();
        }

        // GET: api/DetaljiPlacanja/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetaljiPlacanja>> GetDetaljiPlacanja(int id)
        {
            var detaljiPlacanja = await _context.PaymentDetails.FindAsync(id);

            if (detaljiPlacanja == null)
            {
                return NotFound();
            }

            return detaljiPlacanja;
        }

        // PUT: api/DetaljiPlacanja/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetaljiPlacanja(int id, DetaljiPlacanja detaljiPlacanja)
        {
            if (id != detaljiPlacanja.idkartice)
            {
                return BadRequest();
            }

            _context.Entry(detaljiPlacanja).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetaljiPlacanjaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DetaljiPlacanja
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DetaljiPlacanja>> PostDetaljiPlacanja(DetaljiPlacanja detaljiPlacanja)
        {
            _context.PaymentDetails.Add(detaljiPlacanja);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetaljiPlacanja", new { id = detaljiPlacanja.idkartice }, detaljiPlacanja);
        }

        // DELETE: api/DetaljiPlacanja/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetaljiPlacanja(int id)
        {
            var detaljiPlacanja = await _context.PaymentDetails.FindAsync(id);
            if (detaljiPlacanja == null)
            {
                return NotFound();
            }

            _context.PaymentDetails.Remove(detaljiPlacanja);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetaljiPlacanjaExists(int id)
        {
            return _context.PaymentDetails.Any(e => e.idkartice == id);
        }
    }
}
