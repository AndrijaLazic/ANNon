import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginServiceService } from 'src/app/shared/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public service:LoginServiceService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm)
  {
    this.service.postFunkcija().subscribe(
      res=>{

      },
      err=>{
        this.toastr.error(err['error'],"ERROR")
      }
    );
  }

}
