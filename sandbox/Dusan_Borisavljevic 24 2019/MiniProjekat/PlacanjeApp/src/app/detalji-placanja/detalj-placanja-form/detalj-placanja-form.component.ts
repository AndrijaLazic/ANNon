import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DetaljPlacanja } from 'src/app/shared/detalj-placanja.model';
import { DetaljPlacanjaService } from 'src/app/shared/detalj-placanja.service';


@Component({
  selector: 'app-detalj-placanja-form',
  templateUrl: './detalj-placanja-form.component.html',
  styles: [
  ]
})
export class DetaljPlacanjaFormComponent implements OnInit {

  constructor(public service:DetaljPlacanjaService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  Potvrda(form:NgForm)
  {
    if(this.service.formData.idkartice==0)
      {
        this.insertuj(form);
      }
      else
      {
        this.update(form);
      }
  }

  insertuj(form:NgForm)
  {
    this.service.postDetaljPlacanja().subscribe(
      res=>{
        this.resetForme(form);
        this.service.osveziListu();
        this.toastr.success("Uspesna","Registracija")
      },
      err=>{
        console.log(err);
      }
    )
  }

  update(form:NgForm)
  {
    this.service.putDetaljPlacanja().subscribe(
      res=>{
        this.resetForme(form);
        this.service.osveziListu();
        this.toastr.info("Uspesan!","UPDATE")
      },
      err=>{
        console.log(err);
      }
    )
  }
  resetForme(form:NgForm)
  {
    form.form.reset();
    this.service.formData=new DetaljPlacanja();
  }

}
