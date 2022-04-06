import { Component, OnInit } from '@angular/core';
import { ChartModel } from 'ag-grid-community';
import{webSocket} from 'rxjs/webSocket'
import { SignalRService } from '../shared/signal-r.service';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trening',
  templateUrl: './trening.component.html',
  styleUrls: ['./trening.component.css']
})
export class TreningComponent implements OnInit {
  ind=false;
  PodaciZaGrafik=[
    {
      "name": "Nepal",
      "series": [
        {
          "value": 6397,
          "name": "2016-09-19T02:35:40.991Z"
        },
        {
          "value": 6933,
          "name": "2016-09-17T06:26:21.804Z"
        },
        {
          "value": 6615,
          "name": "2016-09-22T20:13:32.359Z"
        },
        {
          "value": 4502,
          "name": "2016-09-24T01:16:53.398Z"
        },
        {
          "value": 4963,
          "name": "2016-09-19T16:29:45.242Z"
        }
      ]
    },
    {
      "name": "Martinique",
      "series": [
        {
          "value": 6313,
          "name": "2016-09-19T02:35:40.991Z"
        },
        {
          "value": 6726,
          "name": "2016-09-17T06:26:21.804Z"
        },
        {
          "value": 4132,
          "name": "2016-09-22T20:13:32.359Z"
        },
        {
          "value": 5001,
          "name": "2016-09-24T01:16:53.398Z"
        },
        {
          "value": 3710,
          "name": "2016-09-19T16:29:45.242Z"
        }
      ]
    },
    {
      "name": "Seychelles",
      "series": [
        {
          "value": 2092,
          "name": "2016-09-19T02:35:40.991Z"
        },
        {
          "value": 2328,
          "name": "2016-09-17T06:26:21.804Z"
        },
        {
          "value": 3546,
          "name": "2016-09-22T20:13:32.359Z"
        },
        {
          "value": 4721,
          "name": "2016-09-24T01:16:53.398Z"
        },
        {
          "value": 6009,
          "name": "2016-09-19T16:29:45.242Z"
        }
      ]
    },
    {
      "name": "Afghanistan",
      "series": [
        {
          "value": 6195,
          "name": "2016-09-19T02:35:40.991Z"
        },
        {
          "value": 5177,
          "name": "2016-09-17T06:26:21.804Z"
        },
        {
          "value": 2730,
          "name": "2016-09-22T20:13:32.359Z"
        },
        {
          "value": 3897,
          "name": "2016-09-24T01:16:53.398Z"
        },
        {
          "value": 5773,
          "name": "2016-09-19T16:29:45.242Z"
        }
      ]
    },
    {
      "name": "Saint Vincent and The Grenadines",
      "series": [
        {
          "value": 6211,
          "name": "2016-09-19T02:35:40.991Z"
        },
        {
          "value": 4708,
          "name": "2016-09-17T06:26:21.804Z"
        },
        {
          "value": 4502,
          "name": "2016-09-22T20:13:32.359Z"
        },
        {
          "value": 3919,
          "name": "2016-09-24T01:16:53.398Z"
        },
        {
          "value": 6463,
          "name": "2016-09-19T16:29:45.242Z"
        }
      ]
    }
  ];
  constructor(private signalR:SignalRService, private http: HttpClient) { 
    
  }

  

  ngOnInit(): void {
    this.signalR.startConnection();
    this.signalR.addTransferChartDatalistener();
    //this.signalR.sendRequest();
  }
  SendtoBack()
  {
    var formData = new FormData();
    formData.append("userID",sessionStorage.getItem("userId"));
    formData.append("connectionID",sessionStorage.getItem("connectionID"));
    this.http.post("https://localhost:7286/api/wsCommunication/user",formData).subscribe();
    /*
    const myChart = new Chart('myChart', {
      type: 'line',
      data: {
          labels: ['Epoch','Loss'],
          datasets: [{
              label: 'Epoch',
              data: [this.signalR.data[0]['epocheNumber'][0],this.signalR.data[1]['epocheNumber'][0],this.signalR.data[2]['epocheNumber'][0],this.signalR.data[3]['epocheNumber'][0]],
              backgroundColor: "black",
              borderColor: "black",
              borderWidth: 1
          },
          {
            label: 'Loss',
              data: [5,8,3,4],
              backgroundColor: "red",
              borderColor: "red",
              borderWidth: 1
          }
        
        ]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
   this.ind=true;
   */
  }

}






