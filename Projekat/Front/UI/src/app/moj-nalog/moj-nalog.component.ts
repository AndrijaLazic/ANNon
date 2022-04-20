import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { LoginServiceService } from '../shared/login-service.service';
import { MojNalogModel } from '../shared/mojnalog.model';

@Component({
  selector: 'app-moj-nalog',
  templateUrl: './moj-nalog.component.html',
  styleUrls: ['./moj-nalog.component.css']
})
export class MojNalogComponent implements OnInit {
  jwtHelper=new JwtHelperService();
  token=this.cookie.get('token');
  username:string;
  colorControl="primary";
  url = 'assets/image/pocetna1.png';
  selectedFile:File=null;
  hide1 = true;
  hide2 = true;
  forma=new FormGroup({
   // image:new FormControl(''),
    Username:new FormControl(this.jwtHelper.decodeToken(this.token)['username']),
    StariPassword:new FormControl('',[Validators.required]),
    NoviPassword:new FormControl('',[Validators.minLength(5)]),
    Email:new FormControl(''),
    token:new FormControl('')
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
  
  onSelect(event) {
    let fileType = event.target.files[0].type
    this.selectedFile=<File>event.target.files[0];
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        
      };
    } else {
      this.toastr.error('Molimo vas odaberite sliku')
    }
    
  }

  posaljiZahtev(){
    this.forma.markAllAsTouched();
    if(this.forma.invalid){
      this.toastr.error('Forma nije validna')
    }
    else{
      var parametrizaslanje=new MojNalogModel();
      parametrizaslanje=Object.assign(new MojNalogModel(),this.forma.value);
      parametrizaslanje.token=this.cookie.get('token');
      this.servis.izmeniProfilZahtev(parametrizaslanje).subscribe(
        res=>{
          console.log(res);
        },
        err=>{
          if(err['status']==200)
          {
            
            this.toastr.success(err['error']['text']);
            this.cookie.delete('token');
            this.route.navigate(['login']);
          
          }
          else
          {
            this.toastr.error(err['error'])
          }
        }
      );
      
    }
    
  }

  constructor(private toastr:ToastrService,private servis:LoginServiceService,private cookie:CookieService,private route:Router) { }

  ngOnInit(): void {
  }
  

}
