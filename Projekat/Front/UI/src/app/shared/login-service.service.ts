import { Injectable } from '@angular/core';
import { LoginModel } from './login-model.model';
import{HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { RegisterModel } from './register-model.model';
const jwtHelper=new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http:HttpClient,private cookie:CookieService) { }
  formData:LoginModel=new LoginModel();
  MojNalogForm:RegisterModel=new RegisterModel();
  readonly conStr=Konfiguracija.KonfiguracijaServera.osnovniURL+'api/KontrolerAutorizacije/login';
  readonly conStr2=Konfiguracija.KonfiguracijaServera.osnovniURL+'api/KontrolerAutorizacije/IzmenaProfila'
  readonly conStr3=Konfiguracija.KonfiguracijaServera.osnovniURL+'api/KontrolerAutorizacije/';
  private subject=new Subject<boolean>();
  postFunkcija():Observable<any>
  {
    return this.http.post<any>(this.conStr,this.formData);
  }
  isLoggeidin():boolean
  {
    if(this.cookie.get('token'))
    {
      var token=this.cookie.get('token');
      if(jwtHelper.isTokenExpired(token))
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    return false;
  }
  izmeniProfilZahtev(parametrizaslanje:any)
  {
    console.log(parametrizaslanje);
    return this.http.post(this.conStr2,parametrizaslanje);
  }
  dajSlikuZahtev(username:string)
  {
    let response = this.http.get(this.conStr3+`${username}`+'/dajsliku',
    {
      observe:"response",
      responseType : "blob"
    });
    return response;
  }

  

  
}
