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
    console.log(form)
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

  url = 'assets/image/pocetna1.png';
  onSelect(event) {
    let fileType = event.target.files[0].type
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        
      };
    } else {
      window.alert('Please select correct image format');
    }
    
  }

}
