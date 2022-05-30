import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, JsonpClientBackend,HttpParams, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import { ColDef,GridApi,GridReadyEvent,CellValueChangedEvent, ComponentStateChangedEvent, GridColumnsChangedEvent, CsvExportParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {SharedService} from "../shared-statistic/shared.service";
import { CookieService } from 'ngx-cookie-service';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemoFilePickerAdapter } from './UploadAdapter.adapter';
import { FilePreviewModel, UploaderCaptions, UploadResponse, UploadStatus, ValidationError } from 'ngx-awesome-uploader';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { UploadFajlServisService } from './upload-fajl-servis.service';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  podaci=[];
  sent:boolean = false;
  received:boolean=false;
  public progress: number;
  public message: string;
  public imeFajla:string;
  public VelicinaFajla:number;
  model:DataModel;
  statistika:Object;

  minStrana=0;
  maxStrana=0;

  forma=new FormGroup({
    trenutnaStrana:new FormControl('1',[Validators.required])
  })
  get trenutnaStrana(){
    return this.forma.get('trenutnaStrana');
  }



  @Output() public onUploadFinished = new EventEmitter();
  
  public adapter = new DemoFilePickerAdapter(this.http,this.spinner,this.toastr);

  
  constructor(public servisZaSlanjeFajla:UploadFajlServisService,private cookie:CookieService,private spinner:NgxSpinnerService,private papa:Papa,private http:HttpClient,private toastr:ToastrService,private route:Router,private shared: SharedService 
    ) {
      this.model = new DataModel();
      this.spinner.hide("Spiner1");
     }
  
  readonly baseURL=Konfiguracija.KonfiguracijaServera.osnovniURL
  KoloneDef: ColDef[] = [];
  RedoviPodaci:any = [];

  onGridColumnsChanged(event: GridColumnsChangedEvent){
    this.spinner.hide("Spiner1");
}
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.minStrana=1;
    this.maxStrana=this.gridApi.paginationGetTotalPages();
    this.spinner.hide("Spiner1");
  }
  onComponentStateChanged(event: ComponentStateChangedEvent){
    this.spinner.hide("Spiner1");
  }

  
  setSession()
  {
    sessionStorage.setItem('userId',uuidv4());
  }
  deleteSessionStorage()
  {
    if(localStorage.getItem("parametars") != null)
      localStorage.removeItem("parametars");
    if(localStorage.getItem("izabrani-parametri") != null)
      localStorage.removeItem("izabrani-parametri");
    if(localStorage.getItem("statistic") != null)
     localStorage.removeItem("statistic");
  }
  onFileSelected(fajl: FilePreviewModel)
  {
    this.setSession();

    //brisanje session storage-a
    this.deleteSessionStorage();


    if (fajl) 
    {
      this.spinner.show("Spiner1")
      var file = fajl.file;
      this.imeFajla=fajl.fileName;
      this.VelicinaFajla=fajl.file.size;
      var parseResult : ParseResult = this.papa.parse(file,{
        header:false,
        skipEmptyLines:true,
        dynamicTyping: true,
        delimiter: "",
        preview:1,
        complete: (results) =>
        {
          this.zaglavlja = results.data[0]
          
        }
      });
      var parseResult : ParseResult = this.papa.parse(file,{
        header:true,
        skipEmptyLines:true,
        dynamicTyping: true,
        delimiter: "",
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
    this.cookie.delete('params');
    
    

    this.KoloneDef = [];
    this.RedoviPodaci = [];
    for(let header of this.zaglavlja)
    {
      var col = {
        flex: 1,
        headerName:header,
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

    console.log(this.KoloneDef)
    
    
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

  procenatUploada=0;
  public uploadFile(){
    
    this.spinner.show("Spiner2");
    
    const params:CsvExportParams = {suppressQuotes: true,columnSeparator:"|"};
    let file = new File([this.gridApi.getDataAsCsv(params)],this.imeFajla ,{type: 'application/vnd.ms-excel'});

    
    // this.http.post(api, form, {reportProgress: true, observe: 'events'})
    //   .subscribe(event => {
    //     if (event.type === HttpEventType.UploadProgress){
    //       this.procenatUploada = Math.round(100 * event.loaded / event.total);
    //       if(this.procenatUploada==100){
    //         this.spinner.hide("Spiner2");
    //         this.spinner.show("Spiner3");
    //       }
    //     }
    //     else if (event.type === HttpEventType.Response) {
    //       this.message = 'Upload success.';
    //       this.spinner.show("Spiner3");
    //       this.getStatistic();
    //       this.onUploadFinished.emit(event.body);
    //     }
    //   });

    this.servisZaSlanjeFajla.upload(file).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.procenatUploada = Math.round(100 * event.loaded / event.total);
          if(this.procenatUploada==100){
            this.spinner.hide("Spiner2");
            this.spinner.show("Spiner3");
          }
        } else if (event instanceof HttpResponse) {
          if(event.ok){
            this.getStatistic();
          }
          else{
            this.spinner.hide("Spiner2");
            this.spinner.hide("Spiner3");
            this.toastr.error("Greška prilikom slanja fajla!","Greška");
          }
        }
      },
      error: (err: any) => {
        this.spinner.hide("Spiner2");
        this.spinner.hide("Spiner3");
        console.log(err);
        this.progress = 0;
        this.toastr.error("Greška prilikom slanja fajla!","Greška");
        // if (err.error && err.error.message) {
        //   this.message = err.error.message;
        // } else {
        //   this.message = 'Could not upload the file!';
        // }
      }
    });
    if(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
    {
      localStorage.removeItem('izabrani-parametri-za-istreniran-model');
    }
  }
  getStatistic()
  {
    const params = new HttpParams()
    .set('userID',sessionStorage.getItem("userId"));
    this.http.get(this.baseURL+"api/MachineLearning/getStatistic",{params:params}).subscribe(
      res=>{
        this.received=true;
        this.statistika = res as Object;
        localStorage.setItem("statistic", JSON.stringify(this.statistika));
        console.log(localStorage.getItem("statistic"));
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
        this.spinner.hide("Spiner3");
        console.log(err);
        switch(err["status"])
        {
          case 500:{
            this.toastr.error("Greška pri komunikaciji sa mikroservisom!","Greška");
            break;
          }
          default:{
            this.toastr.error("Greška pri obradi statistike! \nPokušajte ponovo!","Greška");
            break;
          }
        }
        console.log(typeof(err["status"]))
        this.spinner.hide("Spiner3");
      }
    );

    
  }
  public uploadSuccess(event): void {
    console.log(event);
  }

  ngOnInit(): void {
    
  }








  MaksVelicinaFajla=100;

  public myFiles: FilePreviewModel[] = [];

  public captions: UploaderCaptions = {
    dropzone: {
      title: '',
      or: '',
      browse: '',
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
    if("FILE_MAX_SIZE"==error.error && this.myFiles.length==0){
      alert("Maksimalna velicina fajla je "+this.MaksVelicinaFajla+" Mb")
    }
    else if("FILE_MAX_COUNT"==error.error){
      alert("Izaberite samo jedan fajl")
    }
    else{
      alert(`Fajl nije .csv`);
    }
    // ${error.error}
  }

  public onUploadSuccess(e: FilePreviewModel): void {

    console.log(this.myFiles.length);
  }

  public onRemoveSuccess(e: FilePreviewModel) {
    
    console.log(this.myFiles.length);
    this.myFiles.pop();
    this.podaci=[];
  }
  public onFileAdded(file: FilePreviewModel) {
    
    this.onFileSelected(file);
  }

  public izbrisiFajl(){
    this.podaci=[];
    
  }


  public PromenaStrane(event){
    if(event>this.maxStrana){
      this.forma.controls['trenutnaStrana'].setValue(this.maxStrana);
    }
    else if(event<this.minStrana){
      this.forma.controls['trenutnaStrana'].setValue(this.minStrana);
    }
    this.gridApi.paginationGoToPage(this.trenutnaStrana.value-1)
    console.log(this.maxStrana+" "+ this.minStrana)
  }

}
