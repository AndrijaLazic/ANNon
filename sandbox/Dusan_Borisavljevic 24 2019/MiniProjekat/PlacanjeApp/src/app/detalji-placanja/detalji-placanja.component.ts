import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DetaljPlacanja } from '../shared/detalj-placanja.model';
import { DetaljPlacanjaService } from '../shared/detalj-placanja.service';

@Component({
  selector: 'app-detalji-placanja',
  templateUrl: './detalji-placanja.component.html',
  styles: [
  ]
})
export class DetaljiPlacanjaComponent implements OnInit {

  constructor(public service:DetaljPlacanjaService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.osveziListu();
  }
  popuniformu(selectedRecord:DetaljPlacanja)
  {
      this.service.formData=Object.assign({},selectedRecord);

  }

  Delete(id:number)
  {
    if(confirm("Da li ste sigurni da zelite da izbrisete?"))
    {
    this.service.DeleteFunkcija(id).subscribe(
      res=>{this.service.osveziListu()
        this.toastr.error("Uspesno!","BRISANJE");
      },
      err=>{console.log(err)}
    )
    }
  }

}
