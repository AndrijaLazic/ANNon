import { Component, OnInit } from '@angular/core';
import { PaymentDetailService } from '../shared/payment-detail.service';
import { PaymentDetail } from 'src/app/shared/payment-detail.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styles: [
  ]
})
export class PaymentDetailsComponent implements OnInit {

  constructor(public service: PaymentDetailService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.refreshList();
  }
  populateForm(selectedRecord:PaymentDetail){
    this.service.formData=Object.assign({},selectedRecord);
  }
  onDelete(id:number){
    if(confirm('Da li ste sigurni da zelite da obrisete?'))
    {
    this.service.deletePaymentDetail(id)
    .subscribe(
      res=>{
        this.service.refreshList();
        this.toastr.error("Obrisano uspesno!",'Registar za placanje');
      },
      err =>{console.log(err)}
    )
    }
  }

}
