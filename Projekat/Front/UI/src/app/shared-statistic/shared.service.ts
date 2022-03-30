import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  statistika:object;
  kolone:any[];
  constructor() { }
  setMessage(stat){
    this.statistika=stat;
  }
  getStatistic(){
    return this.statistika;
  }
  getKolone(){
    return this.kolone;
  }

}
