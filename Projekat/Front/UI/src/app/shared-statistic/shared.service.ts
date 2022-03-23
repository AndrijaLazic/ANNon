import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  statistika:object;
  kolone:any[];
  constructor() { }
  setMessage(stat,kolone){
    this.statistika=stat;
    this.kolone=kolone;
  }
  getStatistic(){
    return this.statistika;
  }
  getKolone(){
    return this.kolone;
  }

}
