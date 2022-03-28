import { Component, OnInit } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-signal-rservice',
  templateUrl: './signal-rservice.component.html',
  styleUrls: ['./signal-rservice.component.css']
})
export class SignalRServiceComponent implements OnInit {

  //public data: ChartModel[];
  public connectionID: string;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.startConnection();
    this.sendRequest();
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
      this.hubConnection.invoke("getconnectionid").then 
      (
        (data) =>
        {
          console.log(data);
          this.connectionID = data;
        }
      )
    }

    sendRequest()
    {
      this.http.get("https://localhost:7286/api/wsCommunication/wsrequest").subscribe
      (
        (data) => console.log(data)
      )
    }
  
  }
