import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { RegisterServiceService } from 'src/app/shared/register-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public service:RegisterServiceService,private toastr:ToastrService,private route:Router,private cookie:CookieService) { }



  ngOnInit(): void {
  }
  onSubmit1(form:NgForm){
    this.service.postFunkcija().subscribe(
      //uspesna registracija
      res=>{
        this.toastr.success(res['data']['message'])
        this.cookie.set('register','uspesna')
        this.route.navigate(['success-register'])
      },
      err=>{
        this.toastr.error(err['error'])
      }
    )
  }

}
