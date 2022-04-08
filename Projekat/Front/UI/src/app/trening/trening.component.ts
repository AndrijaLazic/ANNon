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
@Component({
  selector: 'app-trening',
  templateUrl: './trening.component.html',
  styleUrls: ['./trening.component.css']
})
export class TreningComponent implements OnInit {
  ind=false;
  legenda=true;
  prikaziXlabel=true;
  prikaziYlabel=true;
  xLabela='vreme';
  yLabela='vrednost'
  yOsa=true;
  xOsa=true;
  @ViewChild(IzborParametaraComponent, {static : true}) child : IzborParametaraComponent;
  linija=shape.curveBasis;
  readonly osnovniUrl=Konfiguracija.KonfiguracijaServera.osnovniURL;
  
  constructor(public signalR:SignalRService, private http: HttpClient) { 
  }

  

  ngOnInit(): void {
    this.signalR.startConnection();
    this.signalR.addTransferChartDatalistener();
    
  }
  SendtoBack()
  {
    this.child.dajParametre();
  }

  ispis(item:ObjekatZaSlanje){
    
    if(item){
      console.log(JSON.stringify(item))
      var formData = new FormData();
      formData.append("userID",sessionStorage.getItem("userId"));
      formData.append("connectionID",sessionStorage.getItem("connectionID"));
      formData.append("parametri",JSON.stringify(item));
      this.http.post(this.osnovniUrl+"api/wsCommunication/user",formData).subscribe();
    }
  }
}






