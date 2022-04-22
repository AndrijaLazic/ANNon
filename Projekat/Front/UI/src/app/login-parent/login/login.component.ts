import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginServiceService } from 'src/app/shared/login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, Routes, RoutesRecognized } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private spinner:NgxSpinnerService,public service:LoginServiceService,private toastr:ToastrService,private cookie:CookieService,private route:Router) { }
  
  ngOnInit(): void {
    this.service.formData.username='';
    this.service.formData.password='';
  }
  onSubmit(form:NgForm)
  {
    this.spinner.show("Spiner1")
    this.service.postFunkcija().subscribe(
      token=>{
        this.spinner.hide("Spiner1");
        console.log(token['error'])
      },
      err=>{
        this.spinner.hide("Spiner1");
        if(err['status']==200)
        {
          this.cookie.set('token',err['error']['text']);
          this.toastr.success("Successfully login")
         // let currentUrl = this.route.url;
      //this.route.routeReuseStrategy.shouldReuseRoute = () => false;
     // this.route.onSameUrlNavigation = 'reload';
      this.route.navigate(['success-login']);
          
        }
        else
        {
          this.toastr.error(err['error'])
        }
      }
      
    );
  }
 

}
