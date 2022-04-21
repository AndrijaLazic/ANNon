import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RegisterServiceService } from '../shared/register-service.service';

@Component({
  selector: 'app-register-parent',
  templateUrl: './register-parent.component.html',
  styleUrls: ['./register-parent.component.css']
})
export class RegisterParentComponent implements OnInit {
  domen:string;
  constructor(private registerService:RegisterServiceService,private cookie:CookieService) { }

  ngOnInit(): void {
    let email=this.cookie.get('email')
    this.domen=email.split('@')[1];
  }

  Funkcija(){
    //let email=this.registerService.getEmail();
    //let domen=email.split('@')[1];

  }

}
