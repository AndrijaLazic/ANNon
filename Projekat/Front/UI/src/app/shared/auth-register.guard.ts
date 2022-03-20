import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterServiceService } from './register-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRegisterGuard implements CanActivate {
  constructor(private registerService:RegisterServiceService,private route:Router){}
  canActivate()
  {
      if(this.registerService.isRegister())
      {
        return true;
      }
      this.route.navigate(['signup'])
      return false;
  }
  
    
  
  
}
