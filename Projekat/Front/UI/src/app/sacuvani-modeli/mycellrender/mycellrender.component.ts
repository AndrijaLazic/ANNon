import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { default as Konfiguracija } from '../../../../KonfiguracioniFajl.json';

export interface myCellParams{
  buttonText?:string;
}

@Component({
  selector: 'app-mycellrender',
  template:`<button class="dugme dugmeAnimacija" (click)="onclick($event)">{{buttonText}}</button>`,
  styleUrls: ['../sacuvani-modeli.component.css']
})
export class MycellrenderComponent implements OnInit,ICellRendererAngularComp {
  private params:any;
  readonly osnovniUrl=Konfiguracija.KonfiguracijaServera.osnovniURL;
  buttonText:string;
  @Output() event=new EventEmitter<any>();

  constructor(private cookieService:CookieService,private http:HttpClient,private route:Router,private toastr:ToastrService) { }

  

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
      if(this.buttonText=="Učitaj model")
      {
          form.append("token",this.cookieService.get('token'));
          form.append("userID",sessionStorage.getItem('userId'));
          this.http.post(this.osnovniUrl+"api/KontrolerAutorizacije/"+`${this.cookieService.get('token')}`+'/getmodelbyid',form).subscribe(
            res=>{
              localStorage.setItem('izabrani-parametri',res as string);
              this.route.navigate (['poredjenjeModela']);
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
          this.event.emit(this.params.value);
          return;
        }
      }
    );
    }
    
    //this.params.clicked(this.params.value);
  }
  


}
