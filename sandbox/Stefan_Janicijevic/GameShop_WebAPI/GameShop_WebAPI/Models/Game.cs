using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameShop_WebAPI.Models
{
    public class Game
    {
        private int id;
        private string name;
        private string description;
        private double price;
        private static int counter = 0;
        public Game(string name, string description, double price)
        {
            this.id = ++counter;
            this.name = name;
            this.description = description;
            this.price = price;
        }
        public int ID { get { return this.id; } private set {  } }
        public String Name { get { return this.name; } set { this.name = value; } }
        public String Description { get { return this.description; } set { this.description = value; } }
        public double Price { get { return this.price; } set { this.price = value; } }
        
    }
}
