import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit,Output, EventEmitter, NgModule  } from '@angular/core';
import * as XLSX from 'xlsx';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {SharedService} from "../shared-statistic/shared.service";
import { v4 as uuidv4 } from 'uuid';
export class DataModel
{
  fileName:string="";
  file:File;
  statistic:string="";
}


NgModule({
  imports: [ NgxPaginationModule ]
})


@Component({
  selector: 'app-excelsheet',
  templateUrl: './excelsheet.component.html',
  styleUrls: ['./excelsheet.component.css']
})

export class ExcelsheetComponent implements OnInit {

  p:any=[];
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();

  vrednost: any;
  data: any[][];
  fajl: File;
  checkedList:any[];
  sent:boolean = false;
  model:DataModel;
  kolone:any[];
  constructor(private http:HttpClient,private toastr:ToastrService,private route:Router,private shared: SharedService ) {
    this.model = new DataModel();
   }

  readonly baseURL='https://localhost:7286/';


  ngOnInit(): void {
  }
  onFileChange(evt: any){
    const target :DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length!==1) throw new Error('Ne moze se koristiti vise fajlova');

    this.fajl=target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload=(e: any) =>{
      this.posaljiFajl();
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook=XLSX.read(bstr,{type: 'binary'});

      const wsname : string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet=wb.Sheets[wsname];

      
      
      this.data=(XLSX.utils.sheet_to_json(ws,{header: 1}));
      
    };

    reader.readAsBinaryString(target.files[0]);

    
  

    }

  izmena(row,cell){
    if(this.p==0)
      console.log(row+" "+cell);
    else
      console.log(row+40*(this.p-1)+" "+cell);
    this.vrednost = (<HTMLInputElement>document.getElementById(row+","+cell)).value;
    let isnum = /^\d.+$/.test(this.vrednost);
    if(this.p==0)
    {
      if(isnum)
        this.data[row][cell]=parseFloat(this.vrednost);
      else
        this.data[row][cell]=this.vrednost;
    }
    else
    {
      if(isnum)
        this.data[row+40*(this.p-1)][cell]=parseFloat(this.vrednost);
      else
        this.data[row+40*(this.p-1)][cell]=this.vrednost;
    }
    
    
    console.log(this.data);
  }
  setSession()
  {
    sessionStorage.setItem('userId',uuidv4());
  }
  posaljiFajl()
  {
      const formData = new FormData();
      this.setSession();
      formData.append("uploadedFile",this.fajl);
      formData.append("userID",sessionStorage.getItem('userId'));/*DA SE POSALJE ID KORISNIKA ZAJEDNO SA FAJLOM*/
      this.http.post(this.baseURL+"api/MachineLearning/uploadFile",formData)
      .subscribe(
        res=>{
           this.sent = res as boolean;
        },
        err=>{
         
        }
       
      );
      
      
  }
  uzmiStatistiku(){     
    console.log(this.sent);
    if(this.sent)
    {
      this.route.navigate(['./statistic']);
    /*  this.kolone=this.data[0];
      console.log(this.kolone);
      this.shared.setMessage(JSON.parse(this.model.statistic),this.kolone);*/
    }             
   }

  
  

}
