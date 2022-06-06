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
import { MatSelectChange } from '@angular/material/select';
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
      console.log(pom1.MeraUspeha)
      this.setujMeruUspeha(pom1.MeraUspeha);
      this.setujMeruGreske(pom1.MeraGreske);
      this.setujZaglavlje();
      this.izabraniParametri=pom1;
      this.signalR.nacrtajGrafik(pom1['MeraGreskeNaziv']);
      this.sacuvajRezultateTreninga();
      this.StanjeDugmeta2=false;
      this.Testiranje();
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
            localStorage.setItem("poslednjaEpoha",this.signalR.poslednjaEpoha)
            this.StanjeDugmeta=false;
            this.StanjeDugmeta2=false;
            this.pomocnaFunkcija();
            this.Testiranje();
            return;
          }
          this.spinner.hide("Spiner1");
          this.StanjeDugmeta=true;
          this.StanjeDugmeta2=true;
          
        }
      );
  }

  setujZaglavlje(){
    this.zaglavlja[1] = this.MeraGreske+" na trening skupu";
    this.zaglavlja[2] = this.MeraGreske+" na validacionom skupu";
  }

  SendtoBack()
  {
    this.Metrika=null;
    this.prikazanaVrednost=null;
    this.child.dajParametre();
    var params = JSON.parse(localStorage.getItem("parametars"));
    this.setujZaglavlje();

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
    console.log(item);
    this.signalR.podaciZaGrafik=[];
    this.Metrika=null;
    if(item){
      this.setujMeruUspeha(item.MeraUspeha);
      this.setujMeruGreske(item.MeraGreske);
      this.signalR.podaciZaGrafik.push(new podatakZaGrafikKlasa(this.MeraGreske+"na trening skupu"));
      this.signalR.podaciZaGrafik.push(new podatakZaGrafikKlasa(this.MeraGreske+"na test skupu"));
      this.signalR.brojEpoha=1;
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

  metrikaUspeha:any;
  setujMeruUspeha(metrika:string){
    this.metrikaUspeha=metrika;
    if(metrika=='mean_squared_error'){
      this.MeraUspeha="Srednja kvadratna greška";
      return;
    }
    if(metrika=='mean_absolute_percentage_error'){
      this.MeraUspeha="Srednja apsolutna procentna greška";
      return;
    }
    if(metrika=='mean_absolute_error'){
      this.MeraUspeha="Srednja apsolutna greška";
      return;
    }
    if(metrika=='mean_squared_logarithmic_error'){
      this.MeraUspeha="Srednja kvadratna logaritamska greška";
      return;
    }
    if(metrika=='log_cosh'){
      this.MeraUspeha="Srednja kvadratna logaritamska greška";
      return;
    }
    if(metrika=='accuracy'){
      this.MeraUspeha="Tačnost";
      return;
    }
    if(metrika=='binary_accuracy'){
      this.MeraUspeha="Binarna tačnost";
      return;
    }
    if(metrika=='binary_crossentropy'){
      this.MeraUspeha="Binarna krosentropija";
      return;
    }
    if(metrika=='kl_divergence'){
      this.MeraUspeha="K-L divergencija";
      return;
    }
    if(metrika=='categorical_accuracy'){
      this.MeraUspeha="Kategorijska tačnost";
      return;
    }
    if(metrika=='categorical_crossentropy'){
      this.MeraUspeha="Kategorijska krosentropija";
      return;
    }
  }

  metrikaGreske:any;
  setujMeruGreske(metrika:string){
    this.metrikaGreske=metrika;
    console.log("Izmeni"+metrika)
    if(metrika=='mean_squared_error'){
      this.MeraGreske="Srednja kvadratna greška";
      return;
    }
    if(metrika=='mean_absolute_percentage_error'){
      this.MeraGreske="Srednja apsolutna procentna greška";
      return;
    }
    if(metrika=='mean_absolute_error'){
      this.MeraGreske="Srednja apsolutna greška";
      return;
    }
    if(metrika=='mean_squared_logarithmic_error'){
      this.MeraGreske="Srednja kvadratna logaritamska greška";
      return;
    }
    if(metrika=='huber'){
      this.MeraGreske="Huber";
      return;
    }
    if(metrika=='log_cosh'){
      this.MeraGreske="Srednja kvadratna logaritamska greška";
      return;
    }

    if(metrika=='binary_crossentropy'){
      this.MeraGreske="Binarna krosentropija";
      return;
    }
    if(metrika=='kl_divergence'){
      this.MeraGreske="K-L divergencija";
      return;
    }
    if(metrika=='categorical_crossentropy'){
      this.MeraGreske="Kategorijska krosentropija";
      return;
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
      this.toastr.error("Niste uneli naziv modela");
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
          this.spinner.hide("Spiner2");
          this.toastr.error(err['error'])
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

  MeraUspeha:any;

  Metrika:any;
  Testiranje()
  {
    var formData = new FormData();
    
    formData.append('userID',sessionStorage.getItem('userId'));
    formData.append('metric',this.MeraGreske);
    this.http.post(this.osnovniUrl+"api/MachineLearning/compare",formData).subscribe(
      res=>{
        console.log(res)
        this.Metrika=res;
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


  prikazanaVrednost:number;
  prikazanaVrednostPoslednjaEpohe:number;
  PrikaziRezTestiranja(){
    
    this.prikazanaVrednost=this.izabranaMetrikaZaPrikazVrednost;
    this.prikazanaVrednostPoslednjaEpohe=this.poslednjaEpohaVrednost;
    console.log(this.prikazanaVrednostPoslednjaEpohe)
  }


  izabranaMetrikaZaPrikazNaziv:string;
  izabranaMetrikaZaPrikazVrednost:number;
  poslednjaEpohaVrednost:number;
  pom2:any;
  promenaMetrike(event: MatSelectChange){
    
    
    //{'epoch': 4, 'to_send': 'f87c6c93-d899-4e0f-a716-5f49d4b1b254', 'loss': 1.847521424293518, 'accuracy': 0.2447017878293991, 'val_loss': 1.8512725830078125, 'val_accuracy': 0.22900055348873138}
    this.pom2=localStorage.getItem("poslednjaEpoha");
    var pom=this.pom2.replaceAll("'", '"');
    
    let obj = JSON.parse(pom) as object;
    
    if(event.value==0){
      this.izabranaMetrikaZaPrikazVrednost=this.Metrika.loss;
      this.poslednjaEpohaVrednost=obj['loss'];
    }
    else{
      this.izabranaMetrikaZaPrikazVrednost=this.Metrika.metric;
      this.poslednjaEpohaVrednost=obj[this.metrikaUspeha];
    }
    
    
    this.izabranaMetrikaZaPrikazNaziv=event.source.triggerValue;
  }
}






