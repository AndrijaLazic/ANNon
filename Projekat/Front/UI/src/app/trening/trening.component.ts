import { Component, OnInit } from '@angular/core';
import{webSocket} from 'rxjs/webSocket'
@Component({
  selector: 'app-trening',
  templateUrl: './trening.component.html',
  styleUrls: ['./trening.component.css']
})
export class TreningComponent implements OnInit {
  message='poruka';
  subject=webSocket('https://localhost:7286/');
  constructor() { }

  ngOnInit(): void {
  }
  SendtoBack()
  {
    this.subject.subscribe();
    this.subject.next(this.message);//saljem poruku na back
    this.subject.complete()
  }

}
