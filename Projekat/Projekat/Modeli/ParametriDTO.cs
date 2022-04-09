namespace Projekat.Modeli
{
    public class ListaSkrivenihSlojeva
    {
        public int BrojNeurona { get; set; }
        public string AktivacionaFunkcija { get; set; }
    }

    public class ParametriDTO
    {
        public string TipProblema { get; set; }
        public string MeraGreske { get; set; }
        public string MeraUspeha { get; set; }
        public int odnosPodataka { get; set; }
        public List<ListaSkrivenihSlojeva> ListaSkrivenihSlojeva { get; set; }
        public int BrojSlojeva { get; set; }
        public List<Model> NizPromena { get; set; }
        public List<string> UlazneKolone { get; set; }
        public string IzlaznaKolona { get; set; }
        public int BrojEpoha { get; set; }
    }

    public class Model
    {
        public string nazivKolone { get; set; }
        public string tipPodataka { get; set; }
        public string tipEnkodiranja { get; set; }
  
    }
}

