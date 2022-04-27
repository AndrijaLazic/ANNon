import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { response } from 'express';
import { CookieService } from 'ngx-cookie-service';
import { LoginServiceService } from 'src/app/shared/login-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navOpen=false;
  isMenuOpened:boolean=false;
  menuInd:boolean=false;
  login_ind:boolean;
  username:any;
  help=new JwtHelperService();
  url:any="assets/image/pocetna1.png";
  constructor(private loginService:LoginServiceService,private cookie:CookieService,private route:Router) { }

  ngOnInit(): void {
    if(this.loginService.isLoggeidin())
    {
      this.login_ind=true;
      let tokens=this.cookie.get('token')
      let pom=this.help.decodeToken(tokens);
      this.username=pom['username'];
      this.loginService.dajSlikuZahtev(this.username).subscribe(
        res=>{
            let reader = new FileReader();
            reader.addEventListener("load", () => {
            this.url = reader.result;
           
          }, false);
          reader.readAsDataURL(res.body);
          },
          err=>{
            
          }
          
      )
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
  openMenu()
  {
    this.isMenuOpened=!this.isMenuOpened;
  }
  clickedOutside()
  {
    this.isMenuOpened=false;
  }

  posaljiZahtev()
  {
    console.log("dukila");
  }

  NavBarOpen()
  {
    this.navOpen=!this.navOpen;
  }
}
