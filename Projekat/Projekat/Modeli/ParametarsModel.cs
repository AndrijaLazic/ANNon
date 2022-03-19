namespace Projekat.Modeli
{
    public class ParametarsModel
    {
        public List<string> Input { get; set; } = new List<string>();
        public string Output { get; set; }
        public string Encoding { get; set; }
        public int LayerNumber { get; set; }
        public int NeuronNumver { get;set; }
        public string ActivationFunction { get;set;}


    }
}
