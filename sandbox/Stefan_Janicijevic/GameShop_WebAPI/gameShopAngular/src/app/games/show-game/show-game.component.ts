import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
@Component({
  selector: 'app-show-game',
  templateUrl: './show-game.component.html',
  styleUrls: ['./show-game.component.css']
})
export class ShowGameComponent implements OnInit {

  constructor(private service:SharedService) { }

  gamesList:any = [];
  gameID:string='';
  ngOnInit(): void {
    this.refreshGameList();
  }
  refreshGameList()
  {
    this.service.getAllGames().subscribe(data =>
      { this.gamesList = data;});
  }
  deleteGame(id:number)
  {
    
    this.service.deleteGame(id).subscribe();
    window.location.reload();
    
  }
}
