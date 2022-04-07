namespace Projekat.Modeli
{
    public class ParametarsModel
    {
        public List<TableColumnModel> Input { get; set; } = new List<TableColumnModel>();
        public string Output { get; set; } = string.Empty;
        public int LayerNumber { get; set; } = 0;
        public List<int> NeuronNumber { get;set; } = new List<int>();
        public List<string> ActivationFunction { get; set; } = new List<string>();
        public string LossMetric { get; set; } = string.Empty;
        public string SuccessMetric { get; set; } = string.Empty;
        public string ProblemType { get; set; }  = string.Empty;



    }
}
