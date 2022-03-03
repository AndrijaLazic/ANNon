using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JelenaProjekat.Models
{
    public class Proizvod
    {
        public int id;
        public string naziv;
        public float kolicina;
        public string mernaJedinica;

        public Proizvod(int id,string naziv,float kolicina,string mernaJedinica)
        {
            this.id = id;
            this.naziv = naziv;
            this.kolicina = kolicina;
            this.mernaJedinica = mernaJedinica;
        }

        public override string ToString()
        {
            return naziv + " " + kolicina + mernaJedinica;
        }

    }
}