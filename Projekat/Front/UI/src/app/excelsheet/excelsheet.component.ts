import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit,Output, EventEmitter, NgModule  } from '@angular/core';
import * as XLSX from 'xlsx';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

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
  podaci={
    "numericke_kolone": [
        {
            "ime_kolone": "carat",
            "broj_praznih_polja": 0.0,
            "prosek": 0.7979397478679852,
            "standardna_devijacija": 0.47401124440538067,
            "minimum": 0.2,
            "prvi_kvartal": 0.4,
            "drugi_kvartal": 0.7,
            "treci_kvartal": 1.04,
            "maximum": 5.01,
            "broj_autlajera": 439
        },
        {
            "ime_kolone": "depth",
            "broj_praznih_polja": 0.0,
            "prosek": 61.74940489432624,
            "standardna_devijacija": 1.4326213188337733,
            "minimum": 43.0,
            "prvi_kvartal": 61.0,
            "drugi_kvartal": 61.8,
            "treci_kvartal": 62.5,
            "maximum": 79.0,
            "broj_autlajera": 685
        },
        {
            "ime_kolone": "table",
            "broj_praznih_polja": 0.0,
            "prosek": 57.45718390804603,
            "standardna_devijacija": 2.234490562820938,
            "minimum": 43.0,
            "prvi_kvartal": 56.0,
            "drugi_kvartal": 57.0,
            "treci_kvartal": 59.0,
            "maximum": 95.0,
            "broj_autlajera": 336
        },
        {
            "ime_kolone": "price",
            "broj_praznih_polja": 0.0,
            "prosek": 3932.799721913237,
            "standardna_devijacija": 3989.4397381463023,
            "minimum": 326.0,
            "prvi_kvartal": 950.0,
            "drugi_kvartal": 2401.0,
            "treci_kvartal": 5324.25,
            "maximum": 18823.0,
            "broj_autlajera": 1206
        },
        {
            "ime_kolone": "x",
            "broj_praznih_polja": 0.0,
            "prosek": 5.731157211716609,
            "standardna_devijacija": 1.1217607467924422,
            "minimum": 0.0,
            "prvi_kvartal": 4.71,
            "drugi_kvartal": 5.7,
            "treci_kvartal": 6.54,
            "maximum": 10.74,
            "broj_autlajera": 43
        },
        {
            "ime_kolone": "y",
            "broj_praznih_polja": 0.0,
            "prosek": 5.734525954764462,
            "standardna_devijacija": 1.1421346741235396,
            "minimum": 0.0,
            "prvi_kvartal": 4.72,
            "drugi_kvartal": 5.71,
            "treci_kvartal": 6.54,
            "maximum": 58.9,
            "broj_autlajera": 34
        },
        {
            "ime_kolone": "z",
            "broj_praznih_polja": 0.0,
            "prosek": 3.5387337782723316,
            "standardna_devijacija": 0.7056988469499964,
            "minimum": 0.0,
            "prvi_kvartal": 2.91,
            "drugi_kvartal": 3.53,
            "treci_kvartal": 4.04,
            "maximum": 31.8,
            "broj_autlajera": 55
        }
    ],
    "kategoricke_kolone": [
        {
            "ime_kolone": "cut",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 5,
            "najcesca_vrednost": "Ideal",
            "najveci_broj_ponavljanja": 21551
        },
        {
            "ime_kolone": "color",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 7,
            "najcesca_vrednost": "G",
            "najveci_broj_ponavljanja": 11292
        },
        {
            "ime_kolone": "clarity",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 8,
            "najcesca_vrednost": "SI1",
            "najveci_broj_ponavljanja": 13065
        }
    ]
};
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
      formData.append("uploadedFile",this.fajl);
      
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
