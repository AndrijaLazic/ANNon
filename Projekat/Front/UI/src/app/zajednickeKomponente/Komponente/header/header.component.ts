import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuInd:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }
  Funkcija()
  {
    this.menuInd=!this.menuInd;
  }
}
