import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import {ShowGameComponent} from 'src/app/games/show-game/show-game.component';


@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {

  constructor(private service:SharedService) { }

  
  game_name:string='';
  desc:string='';
  price:number = 0;  
  showComponenet = new ShowGameComponent(this.service);
  ngOnInit(): void {
  
  }
  addGame()
  {
    if(this.game_name != "" && this.price >= 0){
      var newGame = {name:this.game_name,description:this.desc,price:this.price}
      this.service.addGame(newGame).subscribe();
      window.location.reload();
    }
    else
    {
      alert("Morate uneti naziv igre i cenu!");
    }
     
  }

}
