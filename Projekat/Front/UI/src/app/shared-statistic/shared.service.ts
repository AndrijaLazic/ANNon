import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  numericki:object;
  kategorijski:object;
  kolone:any[];
  constructor() { }
  setMessage(num,kat,kolone){
    this.numericki=num;
    this.kategorijski=kat;
    this.kolone=kolone;
  }
  getNumericke(){
    return this.numericki;
  }
  getKategorijske(){
    return this.kategorijski;
  }
  getKolone(){
    return this.kolone;
  }

}
