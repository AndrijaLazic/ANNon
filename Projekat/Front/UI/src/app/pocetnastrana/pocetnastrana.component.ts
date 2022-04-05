import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-pocetnastrana',
  templateUrl: './pocetnastrana.component.html',
  styleUrls: ['./pocetnastrana.component.css']
})
export class PocetnastranaComponent implements OnInit {

  constructor() { }

  setSession()
  {
    sessionStorage.setItem('userId',uuidv4());
  }
  ngOnInit(): void {
    this.setSession();
  }


}
