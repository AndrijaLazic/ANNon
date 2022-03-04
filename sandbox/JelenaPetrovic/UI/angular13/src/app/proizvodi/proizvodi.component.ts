import { Component, OnInit } from '@angular/core';
//import { runInThisContext } from 'vm';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-proizvodi',
  templateUrl: './proizvodi.component.html',
  styleUrls: ['./proizvodi.component.css']
})
export class ProizvodiComponent implements OnInit {

  constructor(private service:SharedService) { }

  listaProizvoda:any[]=[];
  poruka:string="";
  clickedEdit:boolean=false;
  clickedAdd:boolean=false;
  toEdit:any;

  ngOnInit(): void {
    this.refreshProductList();
  }

  refreshProductList(){
    this.service.getProductList().subscribe(data=>{this.listaProizvoda=data})
  }

  deleteProduct(val:any){
    if(confirm("Da li ste sigurni??")){
      this.service.deleteSmt(val.id).subscribe(data=>{
        alert(data.toString());
        this.refreshProductList();
      });
    }
  }

  editClicked(val:any){
    this.toEdit=val;
    this.clickedEdit=true;
    this.clickedAdd=false;
  }

  addClicked(){
    this.toEdit={id:0, naziv:"",kolicina:0,mernaJedinica:""};
    this.clickedAdd=true;
    this.clickedEdit=false;
  }
}
