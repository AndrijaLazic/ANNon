import { Injectable, Type } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { epochModel } from './epoch.model';
import { vrednostiZaGrafikKlasa,podatakZaGrafikKlasa } from '../trening/podatakZaGrafik.model';
import { Subject } from 'rxjs';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { ToastrService } from 'ngx-toastr';
import { ObjekatZaSlanje } from '../trening/ObjekatZaSlanje.model';

@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  
  public brojEpoha=0;
  public data;
  public podaciZaGrafik=[];
  public connectionID: string;
  private baseUrl:string =Konfiguracija.KonfiguracijaServera.osnovniURL+"api/wsCommunication/"; 
  private hubConnection: signalR.HubConnection
  public PrikaziLinije=true;
  private poruka=new Subject<number>();
  izabraniParametri:ObjekatZaSlanje;
  porukaObservable$=this.poruka.asObservable();
  poslednjaEpoha:any;
  constructor(private http: HttpClient, private toastr: ToastrService) { }


  public startConnection = () =>
  {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(Konfiguracija.KonfiguracijaServera.osnovniURL+"hub").build();
    
    this.hubConnection.start()
    .then(() => console.log("Connection started!!! "))
    .then(() => this.getConnectionID()) 
    .catch(err => {console.log("Error occurs: "+err);this.toastr.error("Greška pri komunikaciji sa serverom!","Greška")});
  }

 
  public getConnectionID = () =>
  {
    this.hubConnection.on("getConnectionID", (data)=>{
      sessionStorage.setItem("connectionID",data);
  });}

  //this.hubConnection.on("sendResults", (data) => console.log(data))
    //this.hubConnection.onclose(() => (err) => console.log("Restartuje browser!!! \n"+err))
    
    public addTransferChartDatalistener=()=>{
      
      this.hubConnection.on('sendResults',(res)=>{
        
        
        this.data=res.replaceAll("'", '"');
        this.data=JSON.parse(this.data);
        
        
        this.podaciZaGrafik[0].dodajSeries(new vrednostiZaGrafikKlasa(this.data.loss,this.brojEpoha.toString()));
        this.podaciZaGrafik[1].dodajSeries(new vrednostiZaGrafikKlasa(this.data.val_loss,this.brojEpoha.toString()));
        this.poslednjaEpoha=res;
        this.podaciZaGrafik=[...this.podaciZaGrafik];
        
        this.poruka.next(this.brojEpoha);
        this.brojEpoha=this.brojEpoha+1;
        
        

        
      })
    }

    nacrtajGrafik(MeraGreske:string)
    {
      let pom1=JSON.parse(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
      this.podaciZaGrafik.push(new podatakZaGrafikKlasa(MeraGreske+"na trening skupu"));
      this.podaciZaGrafik.push(new podatakZaGrafikKlasa(MeraGreske+"na test skupu"));
      for(var i=0;i<pom1['BrojEpoha'];i++){
          this.podaciZaGrafik[0].dodajSeries(new vrednostiZaGrafikKlasa(pom1['loss'][i],(i+1).toString()));
          //this.podaciZaGrafik=[...this.podaciZaGrafik];
      }
      for(var i=0;i<pom1['BrojEpoha'];i++){
          this.podaciZaGrafik[1].dodajSeries(new vrednostiZaGrafikKlasa(pom1['val_loss'][i],(i+1).toString()));
          //this.podaciZaGrafik=[...this.podaciZaGrafik];
      }
      
        
    }
  
    
}
