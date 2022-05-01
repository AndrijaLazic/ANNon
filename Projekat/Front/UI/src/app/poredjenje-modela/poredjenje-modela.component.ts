import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../shared/signal-r.service';
import { ObjekatZaSlanje } from '../trening/ObjekatZaSlanje.model';

@Component({
  selector: 'app-poredjenje-modela',
  templateUrl: './poredjenje-modela.component.html',
  styleUrls: ['./poredjenje-modela.component.css']
})
export class PoredjenjeModelaComponent implements OnInit {
  izbraniParametri:ObjekatZaSlanje;
  constructor(public signalR:SignalRService){}

  ngOnInit(): void {
    this.izbraniParametri=JSON.parse(localStorage.getItem('izabrani-parametri'));
    console.log(this.izbraniParametri);
  }


}
