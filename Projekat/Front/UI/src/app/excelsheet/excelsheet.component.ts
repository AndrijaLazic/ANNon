import { HttpClient, HttpEventType, HttpRequest, JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit,Output, EventEmitter, NgModule  } from '@angular/core';
import * as XLSX from 'xlsx';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

export class DataModel
{
  fileName:string="";
  file:string="";
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
  constructor(private http:HttpClient,private toastr:ToastrService) {
    this.model = new DataModel();
   }

  readonly baseURL='https://localhost:7286/';


  ngOnInit(): void {
  }
  onFileChange(evt: any){
    const target :DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length!==1) throw new Error('Ne moze se koristiti vise fajlova');
    console.log(target.files[0].name);
    console.log(typeof(target.files[0]));
    this.fajl=target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload=(e: any) =>{
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

  posaljiFajl()
  {
    /*
    const keys = this.data[0];
    const values=this.data.slice(1);
    const objects=values.map(array =>{
      const object={};
      keys.forEach((key,i)=>object[key]=array[i]);

      return object;
    });
    
    console.log(typeof(objects.toString()))
    console.log(JSON.stringify(objects));
    this.model.payload = JSON.stringify(objects);
    this.http.post<string>(this.baseURL+"api/MachineLearning/send",{"payload":this.model.payload})
      .subscribe(
        res=>{
           
        },
        err=>{}
       
      );
      */
      /*const formData = new FormData();
      formData.append(this.fajl, this.fajl.name);*/
      const formData = new FormData();
      formData.append("file",this.fajl,this.fajl.name);
      
      this.http.post(this.baseURL+"api/MachineLearning/uploadFile",formData)
      .subscribe(
        res=>{
           this.sent = true;
           this.model = res as DataModel;
        },
        err=>{}
       
      );
  }
  uzmiStatistiku(){     if(this.sent)       console.log(JSON.parse(this.model.statistic));        }

  
  

}
