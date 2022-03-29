import { Component, OnInit } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-signal-rservice',
  templateUrl: './signal-rservice.component.html',
  styleUrls: ['./signal-rservice.component.css']
})
export class SignalRServiceComponent implements OnInit {

  //public data: ChartModel[];
  public connectionID: string;
  private baseUrl:string = "https://localhost:7286/api/wsCommunication/"; 
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.startConnection();
    
    
  }

    private hubConnection: signalR.HubConnection
  
    public startConnection = () =>
    {
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7286/hub").build();
  
      
      this.hubConnection.start()
      .then(() => console.log("Connection started!!! "))
      .then(() => this.getConnectionID()) 
      .catch(err => console.log("Error occurs: "+err));
    }
  
    private getConnectionID = () =>
    {
      this.hubConnection.on("getConnectionID", (data)=>{
        console.log("ID: "+data);
      
    });

    this.hubConnection.on("sendResults", (data) => console.log(data))
    
    this.hubConnection.onclose(() => (err) => console.log("Restartuje browser!!! \n"+err))

    }

    

   
  
  }
