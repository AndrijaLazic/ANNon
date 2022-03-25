import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, JsonpClientBackend } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import { ColDef,GridApi,GridReadyEvent,CellValueChangedEvent } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {SharedService} from "../shared-statistic/shared.service";

import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';

export class DataModel
{
  fileName:string="";
  file:File;
  statistic:string="";
}

@Component({
  selector: 'app-csv-tabela',
  templateUrl: './csv-tabela.component.html',
  styleUrls: ['./csv-tabela.component.css']
})

export class CsvTabelaComponent implements OnInit {
  public rowSelection = 'multiple';
  public brojElemenataNaStrani = 10;
  private gridApi!: GridApi;
  zaglavlja:any[] = [];
  podaci:any = null;
  sent:boolean = false;
  public progress: number;
  public message: string;
  public imeFajla:string;
  model:DataModel;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private papa:Papa,private http:HttpClient,private toastr:ToastrService,private route:Router,private shared: SharedService 
    ) {
      this.model = new DataModel();
     }
  
  readonly baseURL=Konfiguracija.KonfiguracijaServera.osnovniURL
  KoloneDef: ColDef[] = [];
  RedoviPodaci:any = [];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFileSelected(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    
    if (fileList && fileList?.length > 0) 
    {
      var file = fileList[0];
      this.imeFajla=file.name;
      var parseResult : ParseResult = this.papa.parse(file,{
        header: true,
        skipEmptyLines:true,
        complete: (results) =>
        {
          this.podaci = results.data
          this.IspisTabele()
        }
      });
    }
  }

  IspisTabele()
  {
    if (this.podaci.length > 0) this.zaglavlja = Object.getOwnPropertyNames(this.podaci[0]); 
    this.KoloneDef = [];
    this.RedoviPodaci = [];
    for(let header of this.zaglavlja)
    {
      var col = {
        flex: 1,
        field: header,
        sortable: true,
        filter: true,
        editable: true,
        resizable:true,
        minWidth: 100
      }
      this.KoloneDef.push(col);
    }

    for(let row of this.podaci)
    {
      this.RedoviPodaci.push(row);
    }
  }

  izbrisiSelektovano() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.applyTransaction({ remove: selectedData })!;
    
    for(let sData of selectedData)
    {
      var index = this.podaci.indexOf(sData,0);//vraca index od elementa sData ,potraga pocinje od 0-og elementa,vraca -1 ako element ne postoji
      if (index != -1) this.podaci.splice(index,1);//brise elemente pocev od elementa koji se nalazi na index poziciji i brise se n(u ovom slucaju 1)
    }
  }
  public skiniFajl(){
    this.gridApi.exportDataAsCsv();
  }
  setSession()
  {
    sessionStorage.setItem('userId',uuidv4());
  }
  posaljiFajl()
  {
      this.setSession();
      const formData = new FormData();
      let file = new File([this.gridApi.getDataAsCsv()],this.imeFajla ,{type: 'application/vnd.ms-excel'});
      formData.append("uploadedFile",file);
      formData.append("userID",sessionStorage.getItem("userId"));
      this.http.post(this.baseURL+"api/MachineLearning/uploadFile",formData)
      .subscribe(
        res=>{
           this.sent = true;
           this.model = res as DataModel;
           if(this.sent)
              this.route.navigate(["./statistic"]);
           
        },
        err=>{
          
        }
       
      );
      
  }

  // uzmiStatistiku(){     
    
  //   if(this.sent)
  //   {
  //     this.route.navigate(['./statistic']);
  //     this.kolone=this.data[0];
  //     console.log(this.kolone);
  //     this.shared.setMessage(JSON.parse(this.model.statistic),this.kolone);
  //   }             
  // }

  ngOnInit(): void {
    
  }

}
