namespace Projekat.Modeli
{
    public class NecessaryDataModel
    {
        public string ModelID { get; set; }    
        public DateTime DateSaved { get; set; }
        public string ModelName { get; set; }
        public string Description { get; set; }

        public NecessaryDataModel(string ModelID, DateTime DateSaved, string ModelName, string Description)
        {
            this.ModelID = ModelID;
            this.DateSaved = DateSaved;
            this.ModelName = ModelName;
            this.Description = Description;
        }
    }
}
