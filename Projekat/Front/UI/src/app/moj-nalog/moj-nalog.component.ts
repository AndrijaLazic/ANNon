import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-moj-nalog',
  templateUrl: './moj-nalog.component.html',
  styleUrls: ['./moj-nalog.component.css']
})
export class MojNalogComponent implements OnInit {
  colorControl="primary";
  hide1 = true;
  hide2 = true;
  forma=new FormGroup({
    Username:new FormControl('',[Validators.required]),
    StariPassword:new FormControl('',[Validators.required]),
    NoviPassword:new FormControl(''),
    Email:new FormControl(''),
    // BrojEpoha:new FormControl(5,[Validators.required,Validators.min(),Validators.max()]),
    //odnosPodataka:new FormControl(25)
  })
  get Username(){
    return this.forma.get('Username');
  }
  get StariPassword(){
    return this.forma.get('StariPassword');
  }
  get NoviPassword(){
    return this.forma.get('NoviPassword');
  }
  get Email() {
    return this.forma.get('Email');
  }

  constructor() { }

  ngOnInit(): void {
  }
  

}
