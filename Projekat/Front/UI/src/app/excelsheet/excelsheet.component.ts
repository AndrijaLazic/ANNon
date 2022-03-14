import { HttpClient, HttpEventType, HttpRequest, JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit,Output, EventEmitter, NgModule  } from '@angular/core';
import * as XLSX from 'xlsx';
import {NgxPaginationModule} from 'ngx-pagination';

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
  constructor(private http:HttpClient) {
   }

  readonly baseURL='http://localhost:'


  ngOnInit(): void {
  }
  onFileChange(evt: any){
    const target :DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length!==1) throw new Error('Ne moze se koristiti vise fajlova');

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
  
  posalji(){
    this.http.post(this.baseURL,JSON.stringify(this.data), {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
          
        }
      });
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
    
    
    //this.onFileChange;
    console.log(this.data);
  }

}
