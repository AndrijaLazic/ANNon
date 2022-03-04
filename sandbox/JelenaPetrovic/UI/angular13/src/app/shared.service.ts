import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
readonly ApiUrl='http://localhost:50132/api';


  constructor(private http:HttpClient) { 
  }
  getProductList():Observable<any[]>{
    return this.http.get<any>(this.ApiUrl+"/proizvod");
  }

  addSmt(val:any){
    return this.http.post(this.ApiUrl+"/proizvod",val);
  }

  deleteSmt(val:any){
    return this.http.delete(this.ApiUrl+"/proizvod/"+val)

  }

  editSmt(val:any){
    return this.http.put(this.ApiUrl+"/proizvod",val);
  }
}
