import { Injectable } from '@angular/core';
import { LoginModel } from './login-model.model';
import{HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http'
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
const jwtHelper=new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http:HttpClient,private cookie:CookieService) { }
  formData:LoginModel=new LoginModel();
  readonly conStr=Konfiguracija.KonfiguracijaServera.osnovniURL+'api/KontrolerAutorizacije/login';
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
}
