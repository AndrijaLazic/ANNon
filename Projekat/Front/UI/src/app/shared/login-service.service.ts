import { Injectable } from '@angular/core';
import { LoginModel } from './login-model.model';
import{HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http:HttpClient) { }
  formData:LoginModel=new LoginModel();
  readonly conStr='https://localhost:7286/api/KontrolerAutorizacije/login';
  postFunkcija()
  {
    console.log(this.formData);
    return this.http.post(this.conStr,this.formData);
  }
}
