import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  readonly APIUrl = "https://localhost:5001/api";
  constructor(private http:HttpClient) { }

  getAllGames():Observable<any[]>
  {
    return this.http.get<any>(this.APIUrl+"/games");

  }

  addGame(val:any){
    return this.http.post(this.APIUrl+"/games",val);
  }
  deleteGame(val:number)
  {
    return this.http.delete(this.APIUrl+"/games/"+val);
  }
  showGame(val:number)
  {
    return this.http.get(this.APIUrl+"/games/game/"+val);
  }

}
