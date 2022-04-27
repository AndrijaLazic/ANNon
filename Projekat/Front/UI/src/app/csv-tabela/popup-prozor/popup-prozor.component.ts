import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-popup-prozor',
  templateUrl: './popup-prozor.component.html',
  styleUrls: ['./popup-prozor.component.css']
})
export class PopupProzorComponent implements OnInit {
  fajl:any;
  @Output() newItemEvent = new EventEmitter<any>();
  constructor(public modalRef: MdbModalRef<PopupProzorComponent>) {}

  ngOnInit(): void {
  }

  izborFajla(evt: any){
    const target :DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length!==1) throw new Error('Ne moze se koristiti vise fajlova');

    this.fajl=target.files[0];
    console.log(this.fajl.name)
    this.newItemEvent.emit(evt);

    
  

  }
}
