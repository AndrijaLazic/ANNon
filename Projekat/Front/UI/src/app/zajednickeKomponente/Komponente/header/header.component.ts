import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { LoginServiceService } from 'src/app/shared/login-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuInd:boolean=false;
  login_ind:boolean;
  username:any;
  help=new JwtHelperService();
  constructor(private loginService:LoginServiceService,private cookie:CookieService,private route:Router) { }

  ngOnInit(): void {
    if(this.loginService.isLoggeidin())
    {
      this.login_ind=true;
      let tokens=this.cookie.get('token')
      let pom=this.help.decodeToken(tokens);
      this.username=pom['username'];
    }
    else
    {
      this.login_ind=false;
    }
  }
  Funkcija()
  {
    this.menuInd=!this.menuInd;
  }
  logout()
  {
    this.cookie.delete('token');
    let currentUrl = this.route.url;
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      this.route.onSameUrlNavigation = 'reload';
    this.route.navigate(['pocetna'])
  }
}
