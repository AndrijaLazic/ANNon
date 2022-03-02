import { Injectable } from '@angular/core';
import { DetaljPlacanja } from './detalj-placanja.model';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class DetaljPlacanjaService {

  constructor(private http:HttpClient) { }

  formData:DetaljPlacanja=new DetaljPlacanja();
  list:DetaljPlacanja[];
  readonly URL='http://localhost:22704/api/DetaljiPlacanja'
  postDetaljPlacanja()
  {
     return this.http.post(this.URL,this.formData);
  }
  putDetaljPlacanja()
  {
     return this.http.put(`${this.URL}/${this.formData.idkartice}`,this.formData);
  }

  DeleteFunkcija(id:number)
  {
    return this.http.delete(`${this.URL}/${id}`);
  }
  osveziListu()
  {
    this.http.get(this.URL)
    .toPromise().then(res=>this.list=res as DetaljPlacanja[]);
  }
}
