import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, JsonpClientBackend,HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import { ColDef,GridApi,GridReadyEvent,CellValueChangedEvent, ComponentStateChangedEvent, GridColumnsChangedEvent } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {SharedService} from "../shared-statistic/shared.service";

import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { NgxSpinnerService } from 'ngx-spinner';

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
  received:boolean=false;
  public progress: number;
  public message: string;
  public imeFajla:string;
  model:DataModel;
  statistika:Object;
  @Output() public onUploadFinished = new EventEmitter();
  
  
  constructor(private spinner:NgxSpinnerService,private papa:Papa,private http:HttpClient,private toastr:ToastrService,private route:Router,private shared: SharedService 
    ) {
      this.model = new DataModel();
      
     }
  
  readonly baseURL=Konfiguracija.KonfiguracijaServera.osnovniURL
  KoloneDef: ColDef[] = [];
  RedoviPodaci:any = [];

  onGridColumnsChanged(event: GridColumnsChangedEvent){
    this.spinner.hide("Spiner1");
}
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.spinner.hide("Spiner1");
  }
  onComponentStateChanged(event: ComponentStateChangedEvent){
    this.spinner.hide("Spiner1");
  }
  onFileSelected(event:Event)
  {
    

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    
    if (fileList && fileList?.length > 0) 
    {
      this.spinner.show("Spiner1")
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
      this.spinner.show("Spiner2");
      
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
           {
             this.getStatistic();
           }
              
           
        },
        err=>{
          
        }
       
      );
      
  }

  getStatistic()
  {
    const params = new HttpParams()
    .set('userID',sessionStorage.getItem("userId"));
    console.log(params.get("userID"));
    this.http.get(this.baseURL+"api/MachineLearning/getStatistic",{params:params}).subscribe(
      res=>{
        this.received=true;
        this.statistika = res as Object;
        if(this.received)
        {
          console.log(this.statistika);
          this.spinner.hide("Spiner2");
          this.shared.setMessage(this.statistika);
          this.route.navigate(["./statistic"]);
        }
        
      },
      err=>{
       
      }
    );

    
  }


  ngOnInit(): void {
    
  }

}
