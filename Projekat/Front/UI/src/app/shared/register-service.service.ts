import { Injectable } from '@angular/core';
import { RegisterModel } from './register-model.model';
import{HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {

  constructor(private http:HttpClient) { }
  formdata:RegisterModel=new RegisterModel();
  readonly conStr='https://localhost:7286/api/KontrolerAutorizacije/registacija';
  postFunkcija()
  {
    return this.http.post(this.conStr,this.formdata);
  }
}
