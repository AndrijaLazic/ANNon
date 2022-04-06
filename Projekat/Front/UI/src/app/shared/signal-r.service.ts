import { Injectable, Type } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { epochModel } from './epoch.model';
import { vrednostiZaGrafikKlasa,podatakZaGrafikKlasa } from '../trening/podatakZaGrafik.model';


@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  
  public brojEpoha=0;
  public data;
  public podaciZaGrafik=[];
  public connectionID: string;
  private baseUrl:string = "https://localhost:7286/api/wsCommunication/"; 
  private hubConnection: signalR.HubConnection
  constructor(private http: HttpClient) { }
  public startConnection = () =>
  {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7286/hub").build();
    
    this.hubConnection.start()
    .then(() => console.log("Connection started!!! "))
    .then(() => this.getConnectionID()) 
    .catch(err => console.log("Error occurs: "+err));
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
        
        if(this.podaciZaGrafik.length==0){
          
          this.podaciZaGrafik.push(new podatakZaGrafikKlasa("loss"));
          this.podaciZaGrafik.push(new podatakZaGrafikKlasa("preciznost"));
          this.brojEpoha=this.brojEpoha+1;
        }
        this.data=res.replaceAll("'", '"');
        this.data=JSON.parse(this.data);
        console.log(this.data)
        this.podaciZaGrafik[0].dodajSeries(new vrednostiZaGrafikKlasa(this.data.loss,this.brojEpoha.toString()));
        this.podaciZaGrafik[1].dodajSeries(new vrednostiZaGrafikKlasa(this.data.accuracy,this.brojEpoha.toString()));
        this.podaciZaGrafik=[...this.podaciZaGrafik];
        this.brojEpoha=this.brojEpoha+1;
        
        

        
      })
    }
    
  
}
