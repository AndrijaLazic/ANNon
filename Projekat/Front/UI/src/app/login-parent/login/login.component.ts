import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginServiceService } from 'src/app/shared/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public service:LoginServiceService) { }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm)
  {
    this.service.postFunkcija().subscribe(
      res=>{

      },
      err=>{
        console.log(err);
      }
    );
  }

}
