import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { LoginServiceService } from 'src/app/shared/login-service.service';
import { ObjekatZaSlanje } from 'src/app/trening/ObjekatZaSlanje.model';
import { default as Konfiguracija } from '../../../../KonfiguracioniFajl.json';
import { v4 as uuidv4 } from 'uuid';


export interface myCellParams{
  buttonText?:string;
}

@Component({
  selector: 'app-mycell-render',
  template:`<button class="dugme dugmeAnimacija" (click)="onclick($event)">{{buttonText}}</button>`,
  styleUrls: ['../sacuvani-modeli.component.css']
})
export class MycellRenderComponent implements OnInit {

  private params:any;
  readonly osnovniUrl=Konfiguracija.KonfiguracijaServera.osnovniURL;
  buttonText:string;
  @Output() event1=new EventEmitter<string>();

  constructor(private cookieService:CookieService,private http:HttpClient,private route:Router,private toastr:ToastrService,private servis:LoginServiceService) { }

  

  ngOnInit(): void {
  }


  agInit(params: ICellRendererParams & myCellParams): void {
    this.params=params;
    this.buttonText=params.buttonText;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onclick(event){

      let form=new FormData();
      form.append("modelID",this.params.value);
      if(this.buttonText=="Uporedi model" || this.buttonText=="Učitaj model")
      {
          form.append("token",this.cookieService.get('token'));
          form.append("userID",sessionStorage.getItem('userId'));
          this.http.post(this.osnovniUrl+"api/KontrolerAutorizacije/"+`${this.cookieService.get('token')}`+'/getmodelbyid',form).subscribe(
            res=>{
              if(this.buttonText=="Uporedi model")
              {
                var ParametriZaSlanje=new ObjekatZaSlanje(); 
                ParametriZaSlanje=Object.assign(new ObjekatZaSlanje(), JSON.parse(res['parametars']));
                ParametriZaSlanje.Naziv=res['model']['ModelName'];
                ParametriZaSlanje.ModelId=res['model']['ModelID'];
                localStorage.setItem('izabrani-parametri',JSON.stringify(ParametriZaSlanje));
                this.route.navigate (['poredjenjeModela']);
              }
              else
              {
                if(!sessionStorage.getItem('UserId'))
                {
                  sessionStorage.setItem('userId',uuidv4());
                }
                var ParametriZaSlanje=new ObjekatZaSlanje(); 
                ParametriZaSlanje=Object.assign(new ObjekatZaSlanje(), JSON.parse(res['parametars']));
                localStorage.setItem('izabrani-parametri-za-istreniran-model',JSON.stringify(ParametriZaSlanje));
                this.route.navigate (['training']);
              }
              
            },
            err=>{
              console.log(err);
            }
          )

      }
      

    else
    {
      
      form.append("jwt",this.cookieService.get('token'));
      this.http.delete(this.osnovniUrl+"api/KontrolerAutorizacije/delete-model",{body:form}).subscribe(
      res=>{
        console.log(res);
        
      },
      err=>{
        console.log(err);
        if(err['status']==200)
        {
          this.toastr.success(err['error']['text']);
          let currentUrl = this.route.url;
          this.route.routeReuseStrategy.shouldReuseRoute = () => false;
          this.route.onSameUrlNavigation = 'reload';
          this.route.navigate([currentUrl]);
        }
      }
    );
    }
    
    //this.params.clicked(this.params.value);
  }



}
