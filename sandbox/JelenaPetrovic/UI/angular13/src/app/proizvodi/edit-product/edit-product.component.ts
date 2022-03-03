import { Component, OnInit ,Input} from '@angular/core';
import {SharedService} from 'src/app/shared.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  constructor(private service:SharedService) { }

  @Input() proizvod:any;


  ngOnInit(): void {
  }

  addProduct(){
    this.service.addSmt(this.proizvod).subscribe(data=>{alert(data.toString())});
  }

  editProduct(){
    this.service.editSmt(this.proizvod).subscribe(data=>{alert(data.toString())});
  }

}
