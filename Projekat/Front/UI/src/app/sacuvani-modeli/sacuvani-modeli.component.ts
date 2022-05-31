import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../shared/login-service.service';
import { HttpClient } from '@angular/common/http';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { CookieService } from 'ngx-cookie-service';
import { ColDef, GridApi, GridColumnsChangedEvent, GridReadyEvent, RowSelectedEvent } from 'ag-grid-community';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { MycellRenderComponent } from './mycell-render/mycell-render.component';
import e from 'express';

@Component({
  selector: 'app-sacuvani-modeli',
  templateUrl: './sacuvani-modeli.component.html',
  styleUrls: ['./sacuvani-modeli.component.css']
})
export class SacuvaniModeliComponent implements OnInit {

    modeliZaUlogovanogKorisnika:any=[];
    readonly osnovniUrl=Konfiguracija.KonfiguracijaServera.osnovniURL;
    RedoviPodaci1:any = [];
    KoloneDef1: ColDef[] = [];


  // indikator11:boolean=false;
    constructor(private loginService:LoginServiceService,private http:HttpClient,private cookieService:CookieService,private modalService:NgbModal,private toastr:ToastrService,private route:Router) { }

    ngOnInit(): void {
    
      sessionStorage.setItem("redirectTo",this.route.url);
      if(this.loginService.isLoggeidin())
      {
        this.http.get(this.osnovniUrl+"api/KontrolerAutorizacije/"+`${this.cookieService.get('token')}`+'/getAllModels').subscribe(
          res=>{
            this.modeliZaUlogovanogKorisnika=res;
            this.ispisTabele1();
            console.log(res);
          },
          err=>{
            console.log(err)
          }
        )
      }

    }

    //tabela
    indikator:Boolean=false;
    public brojElemenataNaStrani1 = 4;
    public rowSelection1 = 'multiple';
    private gridApi1!: GridApi;
    minStrana1=0;
    maxStrana1=0;
    zaglavlja1:any[] = ["Naziv modela","Datum čuvanja"];

    forma=new FormGroup({
      trenutnaStrana:new FormControl('1',[Validators.required])
    })
    get trenutnaStrana(){
      return this.forma.get('trenutnaStrana');
    }

    onGridReady1(params: GridReadyEvent) {
      this.gridApi1 = params.api;
      this.minStrana1=1;
      this.maxStrana1=this.gridApi1.paginationGetTotalPages();
      
    }

    onGridColumnsChanged1(event: GridColumnsChangedEvent){
    }

    ispisTabele1(){
      //console.log(this.modeliZaUlogovanogKorisnika[0].ModelID)
      this.KoloneDef1 = [];
      this.RedoviPodaci1 = [];
      var col;
      for(let i=0;i<this.zaglavlja1.length;i++)
      {
          col = {
            flex: 1,
            field: this.zaglavlja1[i],
            sortable: true,
            filter: true,
            editable: false,
            resizable:true,
            minWidth: 100
          }
    
        this.KoloneDef1.push(col);
      }



      col={
        field:"Poredi modele",
        flex: 1,
        sortable: true,
        filter: true,
        editable: false,
        resizable:true,
        minWidth: 100,
        cellRenderer:MycellRenderComponent,
        cellRendererParams:{
          buttonText:'Uporedi model'
        }
        
      }

      this.KoloneDef1.push(col);

      col={
        field:"Obriši modele",
        flex: 1,
        sortable: true,
        filter: true,
        editable: false,
        resizable:true,
        minWidth: 100,
        cellRenderer:MycellRenderComponent,
        cellRendererParams:{
          buttonText:"Obriši model",
          clicked:function(field:any){
            this.modelId=field;
            this.pomocnaFunkcija(this.modelId as string);
          }
        }
        
      }

      this.KoloneDef1.push(col);

      col={
        field:"Učitaj modele",
        flex: 1,
        sortable: true,
        filter: true,
        editable: false,
        resizable:true,
        minWidth: 100,
        cellRenderer:MycellRenderComponent,
        cellRendererParams:{
          buttonText:"Učitaj model",
          clicked:function(field:any){
            this.modelId=field;
            this.pomocnaFunkcija(this.modelId as string);
          }
        }
        
      }
      this.KoloneDef1.push(col);
      var jsonString:string;
      let obj: any;
      for(let i=0;i<this.modeliZaUlogovanogKorisnika.length;i++)
      {
        jsonString='{"'+this.KoloneDef1[0].field+'":"'+this.modeliZaUlogovanogKorisnika[i].ModelName+'","'+this.KoloneDef1[1].field+'":"'+this.modeliZaUlogovanogKorisnika[i].DateSaved+'","'+this.KoloneDef1[2].field+'":"'+this.modeliZaUlogovanogKorisnika[i].ModelID+'","'+this.KoloneDef1[3].field+'":"'+this.modeliZaUlogovanogKorisnika[i].ModelID+'","'+this.KoloneDef1[4].field+'":"'+this.modeliZaUlogovanogKorisnika[i].ModelID+'"}'

          obj= JSON.parse(jsonString);
          
          this.RedoviPodaci1.push(obj);
      }
      return;

    }
    ModelId:any;
    prikaziRezultate(content)
    {
        this.modalService.open(content);

    }

    onRowSelected1(event: RowSelectedEvent,content) {
      if(event.node.isSelected())
      {
        this.ModelId=event.data.ModelID;
        this.prikaziRezultate(content);

      }
    }

    pomocnaFunkcija(modelID:any)
    {
     alert("pomocna Funkcija")
      this.ModelId=modelID;
      for(let i=0;i<this.modeliZaUlogovanogKorisnika.length;i++)
      {
        if(this.modeliZaUlogovanogKorisnika[i].ModelID==this.ModelId)
        {
          this.modeliZaUlogovanogKorisnika.splice(i,1);
          this.ispisTabele1();
          return;
        }
      }

    }

    dajModelZahtev(){
      alert(this.ModelId);
    }


}
