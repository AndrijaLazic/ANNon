import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, JsonpClientBackend,HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import { ColDef,GridApi,GridReadyEvent,CellValueChangedEvent, ComponentStateChangedEvent, GridColumnsChangedEvent, CsvExportParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {SharedService} from "../shared-statistic/shared.service";

import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemoFilePickerAdapter } from './UploadAdapter.adapter';
import { FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { delay, Observable, of } from 'rxjs';

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
  
  public adapter = new DemoFilePickerAdapter(this.http);

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
  /*setSession()
  {
    sessionStorage.setItem('userId',uuidv4());
  }
  */
  posaljiFajl()
  {
      this.spinner.show("Spiner2");
      
      //this.setSession();
      const formData = new FormData();
      const params:CsvExportParams = {suppressQuotes: true,columnSeparator:"|"};
      let file = new File([this.gridApi.getDataAsCsv(params)],this.imeFajla ,{type: 'application/vnd.ms-excel'});
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
          this.spinner.hide("Spiner2");
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
          sessionStorage.setItem("imeFajla",this.imeFajla);
          this.route.navigate(["./statistic"]);
        }
        
      },
      err=>{
        this.spinner.hide("Spiner2");
      }
    );

    
  }
  public uploadSuccess(event): void {
    console.log(event);
  }

  ngOnInit(): void {
    
  }








  MaksVelicinaFajla=60;

  public myFiles: FilePreviewModel[] = [];

  public captions: UploaderCaptions = {
    dropzone: {
      title: 'Fayllari bura ata bilersiz',
      or: 'və yaxud',
      browse: 'Fayl seçin',
    },
    cropper: {
      crop: 'Iseci',
      cancel: 'Prekini',
    },
    previewCard: {
      remove: 'Izbriši',
      uploadError: 'Greška pri ucitavanju fajla',
    },
  };

  public cropperOptions = {
    minContainerWidth: '300',
    minContainerHeight: '300',
  };

  public onValidationError(error: ValidationError): void {
    alert(this.myFiles.length)
    if("FILE_MAX_SIZE"==error.error && this.myFiles.length==0){
      alert("Maksimalna velicina fajla je "+this.MaksVelicinaFajla+" Mb")
    }
    else if("FILE_MAX_COUNT"==error.error){
      alert("Izaberite samo jedan fajl")
    }
    else{
      alert(`Validation Error ${error.error}`);
    }
  }

  public onUploadSuccess(e: FilePreviewModel): void {
    console.log(e);
    console.log(this.myFiles);
  }

  public onRemoveSuccess(e: FilePreviewModel) {
    console.log(e);
  }
  public onFileAdded(file: FilePreviewModel) {
    
  }


  public myCustomValidator(file: File): Observable<boolean> {
    if (!file.name.includes('uploader')) {
      return of(true).pipe(delay(2000));
    }
    return of(false).pipe(delay(2000));
  }

  public dajVelicinuFajla(){
    
  }
}
