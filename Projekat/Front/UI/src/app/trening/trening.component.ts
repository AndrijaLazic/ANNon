import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ChartModel, ColDef, GridApi, GridColumnsChangedEvent, GridReadyEvent } from 'ag-grid-community';
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
import e from 'express';
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
  yLabela=''
  yOsa=true;
  xOsa=true;
  BrojEpoha=0;
  StanjeDugmeta=false;
  StanjeDugmeta2=true;
  izabraniParametri:ObjekatZaSlanje;
  loss=[];
  val_loss=[];
  moj=[];
  RedoviPodaci:any = [];
  KoloneDef: ColDef[] = [];
  zaglavlja:any=["Broj epohe","Loss","Val loss"];
  public brojElemenataNaStrani = 10;
  public rowSelection = 'multiple';
  private gridApi!: GridApi;
  minStrana=0;
  maxStrana=0;
  opis:any;
  p:number=1;
  MeraGreske:string="";
  podacizaGrafik=[];
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
    if(sessionStorage.getItem('redirectTo')=="/statistic")
    {
      this.Provera();
    }
    sessionStorage.setItem("redirectTo",this.route.url);
    this.signalR.podaciZaGrafik=[];
    if(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
    {
      let pom1=JSON.parse(localStorage.getItem('izabrani-parametri-za-istreniran-model'));
      this.izabraniParametri=pom1;
      this.signalR.nacrtajGrafik(pom1['MeraGreskeNaziv']);
      this.sacuvajRezultateTreninga();
      this.StanjeDugmeta2=false;
    }
    if(!this.cookieService.check('params')){
      this.route.navigate(["./statistic"]);
    }

    this.signalR.startConnection();
    this.signalR.addTransferChartDatalistener();
    this.signalR.porukaObservable$
      .subscribe(
        poruka=>{
          if(poruka==this.BrojEpoha){
            this.StanjeDugmeta=false;
            this.StanjeDugmeta2=false;
            this.pomocnaFunkcija();
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
    
    console.log(JSON.stringify(this.izabraniParametri))
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
    this.signalR.podaciZaGrafik.push(new podatakZaGrafikKlasa(this.MeraGreske+"na trening skupu"));
    this.signalR.podaciZaGrafik.push(new podatakZaGrafikKlasa(this.MeraGreske+"na test skupu"));
    this.signalR.brojEpoha=1;
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
   
      //this.izabraniParametri.ImeFajla=sessionStorage.getItem("imeFajla");
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
    console.log(this.signalR.podaciZaGrafik)
    for(let j=0;j<this.signalR.podaciZaGrafik[0].series.length;j++)
    {
      let loss=this.signalR.podaciZaGrafik[0].series[j].value;
      this.loss.push(loss);
      this.izabraniParametri.loss.push(loss)
      let val_loss=this.signalR.podaciZaGrafik[1].series[j].value;
      this.val_loss.push(val_loss)
      this.izabraniParametri.val_loss.push(val_loss);
          
    }   
    this.izabraniParametri.ImeFajla=sessionStorage.getItem("imeFajla");
    this.izabraniParametri.MeraGreskeNaziv=this.MeraGreske;
    console.log(JSON.stringify(this.izabraniParametri))
    localStorage.setItem('izabrani-parametri-za-istreniran-model',JSON.stringify(this.izabraniParametri));
    this.IspisTabele();
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
    var jsonString:string;
    let obj: any;
    for(let i=0;i<this.loss.length;i++)
    {
      jsonString='{"'+this.KoloneDef[0].field+'":"'+parseInt((i+1).toString())+'","'+this.KoloneDef[1].field+'":"'+this.loss[i]+'","'+this.KoloneDef[2].field+'":"'+this.val_loss[i]+'"}'
      
      obj= JSON.parse(jsonString);
      
      this.RedoviPodaci.push(obj);
    }

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
  
  previous()
  {
    this.route.navigate(["statistic"]);
  }
  next()
  {
    this.route.navigate(["poredjenjeModela"]);
  }

  novaMeraGreske(naziv:string){
    this.MeraGreske=naziv;
  }

  sacuvajRezultateTreninga()
  {
    let pom1=JSON.parse(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
    this.loss=[];
    this.val_loss=[];
    for(let j=0;j<pom1['BrojEpoha'];j++)
    {
      this.loss.push(pom1['loss'][j]);
      this.val_loss.push(pom1['val_loss'][j]);
        
    }
    this.IspisTabele();
  }

  Provera()
  {
      if(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
      {
        let parametri=JSON.parse(this.cookieService.get('params'))
        console.log(parametri)
        let brojac=0;
        let parametriSacuvani=JSON.parse(localStorage.getItem('izabrani-parametri-za-istreniran-model'));
        if(parametriSacuvani['IzlaznaKolona']==parametri['izlazna'])
        {
          if(parametriSacuvani['UlazneKolone'].length==parametri['nizUlaznih'].length)
          {
            for(let i=0;i<parametriSacuvani['UlazneKolone'].length;i++)
            {
              if(parametriSacuvani['UlazneKolone'][i]!=parametri['nizUlaznih'][i])
              {
                localStorage.removeItem('izabrani-parametri-za-istreniran-model');
                return;
              }
            }
          }
          else
          {
            localStorage.removeItem('izabrani-parametri-za-istreniran-model');
            return;
          }
        }
        else
        {
          localStorage.removeItem('izabrani-parametri-za-istreniran-model');
          return;
        }
      }
  }
}






