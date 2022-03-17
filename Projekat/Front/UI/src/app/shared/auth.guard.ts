import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginServiceService } from './login-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginservice:LoginServiceService,private route:Router){}
  canActivate(){
    if(this.loginservice.isLoggeidin())
    {
      return true;
    }
    this.route.navigate(['pocetna']);
    return false;
  }
  
}
