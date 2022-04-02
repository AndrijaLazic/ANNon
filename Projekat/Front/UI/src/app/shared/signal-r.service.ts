import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { epochModel } from './epoch.model';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: epochModel[];
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
        this.data=res;
        //console.log(this.data);
        
      })
    }
    
    
    
  
}
