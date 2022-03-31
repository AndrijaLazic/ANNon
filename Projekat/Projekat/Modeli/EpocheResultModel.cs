namespace Projekat.Modeli
{
    public class EpocheResultModel
    {
        public int ID { get; set; }
        public List<int> epocheNumber { get; set; }
        public List<double> Loss { get; set; }
        public double Precision { get; set; }
        public EpocheResultModel()
        {
            epocheNumber = new List<int>();
            Loss = new List<double>();
        }
    }
}
