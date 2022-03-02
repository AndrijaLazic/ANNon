using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameShop_WebAPI.Models;
namespace GameShop_WebAPI.Controllers
{
    [Route("api/games")]
    [ApiController] 
    public class GamesController : ControllerBase
    {
        private static List<Game> games = new List<Game>
        {
            new Game("GTA V","Lorem ipsum",14.99),  
            new Game("GTA IV","Lorem ipsum ist doleore et.",9.99),  
            new Game("Uncharted 4","Aads das ashdjka sdkhajk dhas",14.99),  
            new Game("GTA V","Lorem ipsum",14.99)  
        };
        [HttpGet]
        public  List<Game> GetGames()
        {
            return games;
        }
        [HttpGet("game/{id}")]
        public Game getGameByID(int id)
        {
            if (id >= 0 && id < games.Count)
                return games.Find(g => g.ID == id);

            return null;
        }

        [HttpPost]
        public string addGame(Game game)
        {
            string message = "";
            if (game == null)
                message = "Game cannot be added!!!";
            else
            {
                games.Add(game);
                message = "Game added seccessfuly!!!";
            }
            return message;
            
        }

        [HttpPut("{id}")]
        public string updateGame(Game game,int id)
        {
            string message = "Error";
            
            for(int i = 0; i < games.Count; i++)
            {
                if(games[i].ID == id)
                {
                    games[i].Name = game.Name;
                    games[i].Description = game.Description;
                    games[i].Price = game.Price;
                    message = "Success!";
                    break;
                }
            }

            return message;
        }

        [HttpDelete("{id}")]
        public string deleteHero(int id)
        {
            string message = "Game doesnt exist!";
            Game game = games.Find(g => g.ID == id);
            if(game != null)
            {
                games.Remove(game);
                message = "Game is deleted seccessfuly";
            }

            return message;
        }

    }
}
