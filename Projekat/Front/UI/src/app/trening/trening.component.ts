import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ChartModel, GridApi, GridColumnsChangedEvent, GridReadyEvent } from 'ag-grid-community';
import{webSocket} from 'rxjs/webSocket'
import { SignalRService } from '../shared/signal-r.service';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { vrednostiZaGrafikKlasa,podatakZaGrafikKlasa } from './podatakZaGrafik.model';
import * as shape from 'd3-shape';
import { ObjekatZaSlanje } from './ObjekatZaSlanje.model';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { IzborParametaraComponent } from '../izbor-parametara/izbor-parametara.component';
import { CookieService } from 'ngx-cookie-service';
import { statisticModel } from '../shared/statistic-model.model';
import { Router } from '@angular/router';
import { Model } from '../shared/statistic-model.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-trening',
  templateUrl: './trening.component.html',
  styleUrls: ['./trening.component.css']
})
export class TreningComponent implements OnInit {
  checked1=true;
  nazivFajla:any;
  ind=false; 
  legenda=true;
  prikaziXlabel=true;
  prikaziYlabel=true;
  xLabela='epoha';
  yLabela='vrednost'
  yOsa=true;
  xOsa=true;
  BrojEpoha=0;
  StanjeDugmeta=false;
  StanjeDugmeta2=true;
  izabraniParametri:ObjekatZaSlanje;
  loss=[];
  val_loss=[];
  moj=[];
  KoloneDef=[];
  RedoviPodaci=[];
  zaglavlja=["Broj epohe","Loss","Val loss"];
  public brojElemenataNaStrani = 3;
  public rowSelection = 'multiple';
  private gridApi!: GridApi;
  minStrana=0;
  maxStrana=0;
  opis:any;
  p:number=1;
  @ViewChild(IzborParametaraComponent, {static : true}) child : IzborParametaraComponent;
  linija=shape.curveBasis;
  readonly osnovniUrl=Konfiguracija.KonfiguracijaServera.osnovniURL;

  forma=new FormGroup({
    trenutnaStrana:new FormControl('1',[Validators.required])
  })
  get trenutnaStrana(){
    return this.forma.get('trenutnaStrana');
  }

  constructor(private modalService: NgbModal,private spinner:NgxSpinnerService,public signalR:SignalRService, private http: HttpClient,private cookieService:CookieService,private route:Router,private toastr:ToastrService) { 
  }

  

  ngOnInit(): void {
   
    sessionStorage.setItem("redirectTo",this.route.url);
    this.signalR.podaciZaGrafik=[];
    if(!this.cookieService.check('params')){
      this.route.navigate(["./statistic"]);
    }

    this.signalR.startConnection();
    this.signalR.addTransferChartDatalistener();
    this.signalR.podaciZaGrafik.push(new podatakZaGrafikKlasa("loss"));
    this.signalR.podaciZaGrafik.push(new podatakZaGrafikKlasa("val_loss"));
    this.signalR.porukaObservable$
      .subscribe(
        poruka=>{
          if(poruka==this.BrojEpoha){
            this.StanjeDugmeta=false;
            this.StanjeDugmeta2=false;
            return;
          }
          this.spinner.hide("Spiner1");
          this.StanjeDugmeta=true;
          this.StanjeDugmeta2=true;
          
        }
      );
  }
  SendtoBack()
  {
    this.child.dajParametre();
  }
  uporediModele()
  {
    // console.log(sessionStorage.getItem("userId"));
    // const formData = new FormData();
    // formData.append("userID",sessionStorage.getItem("userId"));
    // formData.append("metric","mse");
    // console.log(formData);
    // this.http.post(this.osnovniUrl+"api/MachineLearning/compare",formData).subscribe(
    //   res => console.log(res),
    //   err => console.log(err)
    // )
    for(let i=0;i<this.signalR.podaciZaGrafik.length-1;i++)
    {
      for(let j=0;j<this.signalR.podaciZaGrafik[i].series.length;j++)
      {
          let loss=this.signalR.podaciZaGrafik[i].series[j].value;
          this.izabraniParametri.loss.push(loss);
          let val_loss=this.signalR.podaciZaGrafik[i+1].series[j].value;
          this.izabraniParametri.val_loss.push(val_loss);
        
      }

    }
    this.izabraniParametri.ImeFajla=sessionStorage.getItem("imeFajla");
    localStorage.setItem('izabrani-parametri',JSON.stringify(this.izabraniParametri));
    this.route.navigate (['poredjenjeModela']);



  }
  promenaCurve(event:any){
    if(event.value=="curveBasis"){
      this.linija=shape.curveBasis;
      return;
    }
    this.linija=shape.curveLinear;
  }
  cekiranPrikazGridLinije(value:any){
    this.signalR.PrikaziLinije=value.checked;
  }
  ispis(item:ObjekatZaSlanje){
    this.signalR.podaciZaGrafik=[];
    if(item){
      this.spinner.show("Spiner1");
      var formData = new FormData();
      var pom=new statisticModel();
      pom=Object.assign(new statisticModel(),JSON.parse(this.cookieService.get('params')));
      item.IzlaznaKolona=pom.izlazna;
      item.UlazneKolone=pom.nizUlaznih;
      item.NizPromena=pom.nizPromena;
      this.BrojEpoha=item.BrojEpoha;
      formData.append("userID",sessionStorage.getItem("userId"));
      formData.append("connectionID",sessionStorage.getItem("connectionID"));
      formData.append("parametri",JSON.stringify(item));
      this.izabraniParametri=item;
      localStorage.setItem("parametars",JSON.stringify(item));
      this.http.post(this.osnovniUrl+"api/wsCommunication/user",formData).subscribe();
      
    }
  }

  prikaziRezultate(content)
  {
    if(this.cookieService.get('token'))
    {
      this.modalService.open(content);
    }
    else if(!this.cookieService.get('token'))
    {
      this.preuzmiModel();
    }
    
    
  }

  preuzmiModel()
  {
    console.log(this.signalR.podaciZaGrafik);
      for(let i=0;i<this.signalR.podaciZaGrafik.length-1;i++)
      {
        for(let j=0;j<this.signalR.podaciZaGrafik[i].series.length;j++)
        {
            let loss=this.signalR.podaciZaGrafik[i].series[j].value;
            this.izabraniParametri.loss.push(loss);
            let val_loss=this.signalR.podaciZaGrafik[i+1].series[j].value;
            this.izabraniParametri.val_loss.push(val_loss);
          
        }
        
      }
      this.izabraniParametri.ImeFajla=sessionStorage.getItem("imeFajla");
      //this.moj.push(this.izabraniParametri);
      console.log(this.izabraniParametri);
      var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        //a.style = "display: none";
        return function (data, fileName) {
            var json = JSON.stringify(data),
                blob = new Blob([json], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
    
    var data = this.izabraniParametri,
        fileName = "Rezultati.json";
    
    saveData(data, fileName);
  }

  cuvajModelNaNalogu(content)
  {
    this.modalService.open(content);
    
  }

  cuvajModelNaNalogu2()
  {
    if(!this.nazivFajla)
    {
      this.toastr.error("Niste uneli naziv fajla");
      return;
    }
    if(!this.opis)
    {
      this.toastr.error("Niste uneli opis za model");
      return;
    }
    var formData = new FormData();
    formData.append("token",this.cookieService.get('token'));
    formData.append("userID",sessionStorage.getItem('userId'));
    formData.append("filename",this.nazivFajla);
    formData.append("description",this.opis);
    formData.append("parametars",localStorage.getItem('parametars'));
    this.http.post(this.osnovniUrl+"api/KontrolerAutorizacije/"+`${this.cookieService.get('token')}`+'/save',formData).subscribe(
      res=>{
        console.log(res);
      },
      err=>{
        if(err['status']==200)
        {
          this.toastr.success(err['error']['text']);
        }
        else
        {
          this.toastr.error(err['error']['text'])
        }
      }
    );
  }

  pomocnaFunkcija()
  {
    this.loss=[];
    this.val_loss=[];
    for(let i=0;i<this.signalR.podaciZaGrafik.length-1;i++)
      {
        for(let j=0;j<this.signalR.podaciZaGrafik[i].series.length;j++)
        {
            let loss=this.signalR.podaciZaGrafik[i].series[j].value;
            this.loss.push(loss);
            let val_loss=this.signalR.podaciZaGrafik[i+1].series[j].value;
            this.val_loss.push(val_loss);
          
        }
        
      }
  }

  IspisTabele()
  {
    this.KoloneDef = [];
    this.RedoviPodaci = [];
    let pom=[];
    for(let header of this.zaglavlja)
    {
      var col = {
        flex: 1,
        field: header,
        sortable: true,
        filter: true,
        editable: true,
        resizable:true,
        minWidth: 100
      }
      this.KoloneDef.push(col);
    }
    this.pomocnaFunkcija();
    //for(let i=0;i<this.loss.length;i++)
    //{
     // jsonString='{"Parametri":"'+this.prvaKolona[i]+'","'+this.KoloneDef[1].field+'":"'+matrica[i][0]+'"}'
      //let pom2=i+1;
      //let jsonString2='{'+this.zaglavlja[0]+'":"'+pom2+'","'+this.zaglavlja[1]+'":"'+this.loss[i]+'","'+this.zaglavlja[2]+'":"'+this.val_loss[i]+'}';
      //let obj=JSON.parse(jsonString2);
      //this.RedoviPodaci.push(obj);
    //}

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.minStrana=1;
    this.maxStrana=this.gridApi.paginationGetTotalPages();
    this.spinner.hide("Spiner1");
  }

  onGridColumnsChanged(event: GridColumnsChangedEvent){
    this.spinner.hide("Spiner1");
  }

  public PromenaStrane(event){
    if(event>this.maxStrana){
      this.forma.controls['trenutnaStrana'].setValue(this.maxStrana);
    }
    else if(event<this.minStrana){
      this.forma.controls['trenutnaStrana'].setValue(this.minStrana);
    }
    this.gridApi.paginationGoToPage(this.trenutnaStrana.value-1)
    console.log(this.maxStrana+" "+ this.minStrana)
  }
  key:string='id';
  reverse:boolean=false;
  
  sort(key)
  {
    this.key=key;
    this.reverse=!this.reverse;

  }
}






