import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterServiceService } from 'src/app/shared/register-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public service:RegisterServiceService) { }

  ngOnInit(): void {
  }
  onSubmit1(form:NgForm){
    this.service.postFunkcija().subscribe(
      res=>{

      },
      err=>{
        console.log(err);
      }
    )
  }

}
