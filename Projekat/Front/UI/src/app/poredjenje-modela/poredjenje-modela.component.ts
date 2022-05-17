import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../shared/signal-r.service';
import { ObjekatZaSlanje } from '../trening/ObjekatZaSlanje.model';
import { DemoFilePickerAdapter } from '../csv-tabela/UploadAdapter.adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import * as shape from 'd3-shape';
import { vrednostiZaGrafikKlasa,podatakZaGrafikKlasa } from '../trening/podatakZaGrafik.model';
import { Route, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridColumnsChangedEvent, GridReadyEvent } from 'ag-grid-community';
@Component({
  selector: 'app-poredjenje-modela',
  templateUrl: './poredjenje-modela.component.html',
  styleUrls: ['./poredjenje-modela.component.css']
})
export class PoredjenjeModelaComponent implements OnInit {
  izbraniParametri:ObjekatZaSlanje;
  modeliZaPoredjenje:ObjekatZaSlanje[] = [];
  MaksVelicinaFajla=3;
  public cropperOptions = {
  };
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

  //opcije za grafik
  checked1=true;
  legenda=true;
  prikaziXlabel=true;
  prikaziYlabel=true;
  xLabela='epoha';
  yLabela='vrednost'
  yOsa=true;
  xOsa=true;
  linija=shape.curveBasis;
  public PrikaziLinije=true;
  podaciZaGrafik=[];
  ///////


  constructor(private spinner:NgxSpinnerService,private http:HttpClient,private toastr:ToastrService,private route: Router){
    if(localStorage.getItem('izabrani-parametri')!=null){
      this.dodajModel(JSON.parse(localStorage.getItem('izabrani-parametri')))
    }
  }
  public adapter = new DemoFilePickerAdapter(this.http,this.spinner,this.toastr);
  ngOnInit(): void {
    sessionStorage.setItem("redirectTo",this.route.url)
  }

  public dodajModel(pom:ObjekatZaSlanje){
    this.modeliZaPoredjenje.push(pom);
    this.podaciZaGrafik=[];
    var k=0;
    for(var j=0;j<this.modeliZaPoredjenje.length;j++){
      console.log(this.modeliZaPoredjenje[j])
      if(this.modeliZaPoredjenje[j].Naziv){
        this.podaciZaGrafik.push(new podatakZaGrafikKlasa("loss za "+this.modeliZaPoredjenje[j].Naziv));
        this.podaciZaGrafik.push(new podatakZaGrafikKlasa("val_loss "+this.modeliZaPoredjenje[j].Naziv));
      }
      else{
        this.podaciZaGrafik.push(new podatakZaGrafikKlasa("loss za Model "+(j+1)));
        this.podaciZaGrafik.push(new podatakZaGrafikKlasa("val_loss Model "+(j+1)));
      }
      for(var i=0;i<this.modeliZaPoredjenje[j].BrojEpoha;i++){
        this.podaciZaGrafik[k].dodajSeries(new vrednostiZaGrafikKlasa(this.modeliZaPoredjenje[j].loss[i],(i+1).toString()));
      }
      for(var i=0;i<this.modeliZaPoredjenje[j].BrojEpoha;i++){
        this.podaciZaGrafik[k+1].dodajSeries(new vrednostiZaGrafikKlasa(this.modeliZaPoredjenje[j].val_loss[i],(i+1).toString()));
      }
      k=k+2;
    }
    console.log(this.podaciZaGrafik)
    
  }


  public onValidationError(error: ValidationError): void {
    if("FILE_MAX_SIZE"==error.error){
      this.toastr.error("Maksimalna velicina fajla je "+this.MaksVelicinaFajla+" Mb");
    }
    else if("FILE_MAX_COUNT"==error.error){
      this.toastr.error("Izaberite samo jedan fajl");
    }
    else{
      this.toastr.error(`Fajl nije .csv`);
    }
    // ${error.error}
  }

  public onUploadSuccess(e: FilePreviewModel): void {
  }
  public onRemoveSuccess(e: FilePreviewModel) {
  }
  public onFileAdded(file: FilePreviewModel) {
    this.onFileSelected(file);
  }

  public onFileSelected(file: FilePreviewModel){
    this.ucitajFajl(file.file);
  }
  ucitajFajl(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      let pom = JSON.parse(fileReader.result as string);
      let objekat=pom as ObjekatZaSlanje;
      this.dodajModel(pom);
      
    }
    fileReader.readAsText(file);
}

promenaCurve(event:any){
  if(event.value=="curveBasis"){
    this.linija=shape.curveBasis;
    return;
  }
  this.linija=shape.curveLinear;
}
cekiranPrikazGridLinije(value:any){
  this.PrikaziLinije=value.checked;
}





  //tabela

  forma=new FormGroup({
    trenutnaStrana:new FormControl('1',[Validators.required])
  })
  get trenutnaStrana(){
    return this.forma.get('trenutnaStrana');
  }

  RedoviPodaci:any = [];
  KoloneDef: ColDef[] = [];
  public brojElemenataNaStrani = 10;
  public rowSelection = 'multiple';
  private gridApi!: GridApi;
  minStrana=0;
  maxStrana=0;



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.minStrana=1;
    this.maxStrana=this.gridApi.paginationGetTotalPages();
    this.spinner.hide("Spiner1");
  }
  onGridColumnsChanged(event: GridColumnsChangedEvent){
    this.spinner.hide("Spiner1");
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



