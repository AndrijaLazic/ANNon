import { Injectable } from '@angular/core';
import { RegisterModel } from './register-model.model';
import{HttpClient} from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {

  constructor(private http:HttpClient,private cookie:CookieService) { }
  formdata:RegisterModel=new RegisterModel();
  readonly conStr=Konfiguracija.KonfiguracijaServera.osnovniURL+'api/KontrolerAutorizacije/registracija';
  readonly conStr2=Konfiguracija.KonfiguracijaServera.osnovniURL+'api/EmailKontroler/';
  postFunkcija(form:any)
  {
    return this.http.post(this.conStr,form);
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
