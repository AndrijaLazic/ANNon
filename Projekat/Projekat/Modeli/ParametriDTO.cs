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
    }
}

