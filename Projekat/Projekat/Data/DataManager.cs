using Projekat.Modeli;
namespace Projekat.Data
{
    public class DataManager
    {
        public static List<EpocheResultModel> getData()
        {
            var r = new Random();
            return new List<EpocheResultModel>()
            {
                new EpocheResultModel{epocheNumber=new List<int>{r.Next(1,40) }, Loss=new List<double>{r.Next(1,40)} },
                new EpocheResultModel { epocheNumber = new List<int> { r.Next(1, 40) }, Loss = new List<double> { r.Next(1, 40) } },
                new EpocheResultModel { epocheNumber = new List<int> { r.Next(1, 40) }, Loss = new List<double> { r.Next(1, 40) } },
                new EpocheResultModel { epocheNumber = new List<int> { r.Next(1, 40) }, Loss = new List<double> { r.Next(1, 40) } },
            };
        }
    }
}
