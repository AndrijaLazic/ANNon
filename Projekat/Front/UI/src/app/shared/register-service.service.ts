import { Injectable } from '@angular/core';
import { RegisterModel } from './register-model.model';
import{HttpClient} from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {

  constructor(private http:HttpClient,private cookie:CookieService) { }
  formdata:RegisterModel=new RegisterModel();
  readonly conStr='https://localhost:7286/api/KontrolerAutorizacije/registracija';
  readonly conStr2='https://localhost:7286/api/EmailKontroler/';
  postFunkcija()
  {
    return this.http.post(this.conStr,this.formdata);
  }
  isRegister()
  {
    if(this.cookie.get('register'))
    {
      return true;
    }
    return false;
  }
  verifikacionZahtev(tokens:any):Observable<any>
  {
    return this.http.get<any>(this.conStr2+tokens)
  }
}
