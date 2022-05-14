import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pocetnastrana',
  templateUrl: './pocetnastrana.component.html',
  styleUrls: ['./pocetnastrana.component.css']
})
export class PocetnastranaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    sessionStorage.setItem('redirectTo',this.router.url);
  }


}
