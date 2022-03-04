using JelenaProjekat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JelenaProjekat.Controllers
{
    public class ProizvodController : ApiController
    {
        static List<Proizvod>  proizvodi = new List<Proizvod>(new Proizvod[]{new Proizvod(1,"hleb",5,"kom"), new Proizvod(2, "brasno", 5, "kg") , new Proizvod(3, "mleko", 5, "l") });


        public HttpResponseMessage Get()
        {
            if (proizvodi == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "nema proizvoda");
            }
            return Request.CreateResponse(HttpStatusCode.OK, proizvodi);
        }
        public string Post(Proizvod p)
        {
            p.id = proizvodi[proizvodi.Count() - 1].id + 1;
            proizvodi.Add(p);
            return "dodat proizvod";
        }
        public string Put(Proizvod p)
        {
            foreach(var proizvod in proizvodi)
            {
                if (p.id == proizvod.id)
                {
                    proizvod.naziv = p.naziv;
                    proizvod.kolicina = p.kolicina;
                    proizvod.mernaJedinica = p.mernaJedinica;
                    return "izmenjen proizvod";
                }
            }
            return "nije izmenjen proizvod";
        }
        public string Delete(int id)
        {
            foreach (var proizvod in proizvodi)
            {
                if (id == proizvod.id)
                {
                    proizvodi.Remove(proizvod);
                    Console.WriteLine(proizvodi.Count());
                    return "izbrisan proizvod";
                }
            }
            return "nije izbrisan proizvod";
        }

    }
}
