import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartModel } from 'ag-grid-community';
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
import { ObjekatZaPreuzimanje } from './ObjekatZaPreuzimanje.model';
import { ngxCsv } from 'ngx-csv';
@Component({
  selector: 'app-trening',
  templateUrl: './trening.component.html',
  styleUrls: ['./trening.component.css']
})
export class TreningComponent implements OnInit {
  
  checked1=true;
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
  moj=[];
  @ViewChild(IzborParametaraComponent, {static : true}) child : IzborParametaraComponent;
  linija=shape.curveBasis;
  readonly osnovniUrl=Konfiguracija.KonfiguracijaServera.osnovniURL;
  
  constructor(private spinner:NgxSpinnerService,public signalR:SignalRService, private http: HttpClient,private cookieService:CookieService,private route:Router) { 
  }

  

  ngOnInit(): void {
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
    console.log(sessionStorage.getItem("userId"));
    const formData = new FormData();
    formData.append("userID",sessionStorage.getItem("userId"));
    formData.append("metric","mse");
    console.log(formData);
    this.http.post(this.osnovniUrl+"api/MachineLearning/compare",formData).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
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
      this.BrojEpoha=item.BrojEpoha;
      formData.append("userID",sessionStorage.getItem("userId"));
      formData.append("connectionID",sessionStorage.getItem("connectionID"));
      formData.append("parametri",JSON.stringify(item));
      this.http.post(this.osnovniUrl+"api/wsCommunication/user",formData).subscribe();
    }
  }

  prikaziRezultate()
  {
  
    for(let i=0;i<this.signalR.podaciZaGrafik.length-1;i++)
    {
      for(let j=0;j<this.signalR.podaciZaGrafik[i].series.length;j++)
      {
          let broj_epohe=j+1;
          let loss=this.signalR.podaciZaGrafik[i].series[j].value;
          let val_loss=this.signalR.podaciZaGrafik[i+1].series[j].value;
          this.moj.push(new ObjekatZaPreuzimanje(broj_epohe,loss,val_loss));
        
      }
      
    }
    console.log(this.moj);
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Rezultati treniranja',
      useBom: true,
      headers: ["Broj epohe", "Loss", "Val_loss"]
    };
    new ngxCsv(this.moj,"Rezultati",options)
    this.moj=[];
  }
}






