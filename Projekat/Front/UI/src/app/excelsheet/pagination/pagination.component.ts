import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styles: [
  ]
})
export class PaginationComponent implements OnInit {

  p: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
