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
import { ColDef, GridApi, GridColumnsChangedEvent, GridReadyEvent, RowSelectedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { LoginServiceService } from '../shared/login-service.service';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-poredjenje-modela',
  templateUrl: './poredjenje-modela.component.html',
  styleUrls: ['./poredjenje-modela.component.css']
})
export class PoredjenjeModelaComponent implements OnInit {
  MaksBrojFajlova=2;
  izbraniParametri:ObjekatZaSlanje;
  modeliZaPoredjenje:ObjekatZaSlanje[] = [];
  modeliZaUlogovanogKorisnika:any=[];
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
  readonly osnovniUrl=Konfiguracija.KonfiguracijaServera.osnovniURL;

  constructor(private spinner:NgxSpinnerService,private http:HttpClient,private toastr:ToastrService,private route: Router,private loginService:LoginServiceService,private cookieService:CookieService){
    if(localStorage.getItem('izabrani-parametri')!=null){
      this.dodajModel(JSON.parse(localStorage.getItem('izabrani-parametri')))
    }
    if(this.loginService.isLoggeidin())
    {
      this.http.get(this.osnovniUrl+"api/KontrolerAutorizacije/"+`${this.cookieService.get('token')}`+'/getAllModels').subscribe(
        res=>{
          
          this.modeliZaUlogovanogKorisnika=res;
          this.mojaFunkcija();
        },
        err=>{
          console.log(err)
        }
      )
    }

  }
  public adapter = new DemoFilePickerAdapter(this.http,this.spinner,this.toastr);
  ngOnInit(): void {
    sessionStorage.setItem("redirectTo",this.route.url)
  }

  public dodajModel(pom:ObjekatZaSlanje){
    this.MaksBrojFajlova=this.MaksBrojFajlova-1;
    this.modeliZaPoredjenje.push(pom);
    this.podaciZaGrafik=[];
    var k=0;
    for(var j=0;j<this.modeliZaPoredjenje.length;j++){
      
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
    
    this.IspisTabele();
  }


  public onValidationError(error: ValidationError): void {
    if("FILE_MAX_SIZE"==error.error){
      this.toastr.error("Maksimalna velicina fajla je "+this.MaksVelicinaFajla+" Mb");
    }
    else if("FILE_MAX_COUNT"==error.error){
      this.toastr.error("Izaberite samo "+this.MaksBrojFajlova+" fajla");
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





  //tabela1
  prvaKolona:any=["Tip problema","Mera greske","Mera uspeha","Broj slojeva","Ulazne kolone","Izlazna kolona",
  "Odnos podataka","Broj epoha"]
  
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
  zaglavlja:any[] = [];
 

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
    
  }
  IspisTabele()
  {
    this.KoloneDef = [];
    this.RedoviPodaci = [];
    var matrica:any[][];
    var col = {
      flex: 1,
      field: "Parametri",
      sortable: true,
      filter: true,
      editable: false,
      resizable:true,
      minWidth: 100
    }
    this.KoloneDef.push(col);

    var brojRedova=this.prvaKolona.length;
    for(let i=0;i<this.modeliZaPoredjenje.length;i++){
      if(!this.modeliZaPoredjenje[i].Naziv){
        var col = {
          flex: 1,
          field: "Model"+(i+1),
          sortable: true,
          filter: true,
          editable: false,
          resizable:true,
          minWidth: 100
        }
        this.KoloneDef.push(col);
      }
      else{
        var col = {
          flex: 1,
          field: this.modeliZaPoredjenje[i].Naziv,
          sortable: true,
          filter: true,
          editable: false,
          resizable:true,
          minWidth: 100
        }
        this.KoloneDef.push(col);
      }
      if(this.modeliZaPoredjenje[i].BrojSlojeva+this.prvaKolona.length>brojRedova)
        brojRedova=this.modeliZaPoredjenje[i].BrojSlojeva+this.prvaKolona.length;
      
    }
    // inicijalizovanje matrice
    matrica=[brojRedova]
    this.brojElemenataNaStrani=brojRedova;
    for(let i=0;i<brojRedova;i++){
      matrica[i]=[this.KoloneDef.length-1]
    }
    //
    var pom=0;
    for(let i=0;i<this.modeliZaPoredjenje.length;i++){
        matrica[0][i]=this.modeliZaPoredjenje[i].TipProblema;
        matrica[1][i]=this.modeliZaPoredjenje[i].MeraGreske;
        matrica[2][i]=this.modeliZaPoredjenje[i].MeraUspeha;
        matrica[3][i]=this.modeliZaPoredjenje[i].BrojSlojeva;
        matrica[4][i]=this.modeliZaPoredjenje[i].UlazneKolone;
        matrica[5][i]=this.modeliZaPoredjenje[i].IzlaznaKolona;
        matrica[6][i]=this.modeliZaPoredjenje[i].odnosPodataka;
        matrica[7][i]=this.modeliZaPoredjenje[i].BrojEpoha;
        pom=8;
        for(let j=0;j<this.modeliZaPoredjenje[i].BrojSlojeva;j++){
          matrica[pom][i]=this.modeliZaPoredjenje[i].ListaSkrivenihSlojeva[j].AktivacionaFunkcija+"/"+this.modeliZaPoredjenje[i].ListaSkrivenihSlojeva[j].BrojNeurona;
          pom++;
        }
      
        for(let j=pom;j<brojRedova;j++){
          console.log(pom+" "+brojRedova+" "+i)
          matrica[j][i]="";
        }
    }
    
    console.log(matrica)
    var jsonString:string;
    let obj: any;

    if(this.modeliZaPoredjenje.length==1){
      var j=1;
      for(let i=0;i<brojRedova-this.modeliZaPoredjenje[0].BrojSlojeva;i++){
        
        jsonString='{"Parametri":"'+this.prvaKolona[i]+'","'+this.KoloneDef[1].field+'":"'+matrica[i][0]+'"}'
        
        
        obj= JSON.parse(jsonString);
        
        this.RedoviPodaci.push(obj);
      }
      for(let i=brojRedova-this.modeliZaPoredjenje[0].BrojSlojeva;i<brojRedova;i++){
        jsonString='{"Parametri":"'+'Sloj_'+j+'","'+this.KoloneDef[1].field+'":"'+matrica[i][0]+'"}'
        obj= JSON.parse(jsonString);
        this.RedoviPodaci.push(obj);
        j++;
      }
    }

    if(this.modeliZaPoredjenje.length==2){
      var j=1;
      var pom=this.modeliZaPoredjenje[0].BrojSlojeva;
      if(this.modeliZaPoredjenje[1].BrojSlojeva>pom)
        pom=this.modeliZaPoredjenje[1].BrojSlojeva;
      for(let i=0;i<brojRedova-pom;i++){
        
        jsonString='{"Parametri":"'+this.prvaKolona[i]+'","'+this.KoloneDef[1].field+'":"'+matrica[i][0]+'","'+this.KoloneDef[2].field+'":"'+matrica[i][1]+'"}'
        
        
        obj= JSON.parse(jsonString);
        
        this.RedoviPodaci.push(obj);
      }
      for(let i=brojRedova-pom;i<brojRedova;i++){
        jsonString='{"Parametri":"'+'Sloj_'+j+'","'+this.KoloneDef[1].field+'":"'+matrica[i][0]+'","'+this.KoloneDef[2].field+'":"'+matrica[i][1]+'"}'
        obj= JSON.parse(jsonString);
        this.RedoviPodaci.push(obj);
        j++;
      }
    }

    
  }
  //dukilin(los)deo
  mojaFunkcija()
  {
    this.ispisTabele1();
  }
  //tabela2
  RedoviPodaci1:any = [];
  KoloneDef1: ColDef[] = [];
  public brojElemenataNaStrani1 = 10;
  public rowSelection1 = 'multiple';
  private gridApi1!: GridApi;
  minStrana1=0;
  maxStrana1=0;
  zaglavlja1:any[] = ["Naziv modela","Opis modela","Datum cuvanja","Uporedi model"];

  onGridReady1(params: GridReadyEvent) {
    this.gridApi1 = params.api;
    this.minStrana1=1;
    this.maxStrana1=this.gridApi1.paginationGetTotalPages();
    this.spinner.hide("Spiner1");
  }

  onGridColumnsChanged1(event: GridColumnsChangedEvent){
    this.spinner.hide("Spiner1");
  }
  
  ispisTabele1(){
    this.KoloneDef1 = [];
    this.RedoviPodaci1 = [];
    var col;
    for(let i=0;i<this.zaglavlja1.length;i++)
    {
      if(this.zaglavlja1[i]=="Uporedi model")
      {
         col = {
          flex: 1,
          field: this.zaglavlja1[i],
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          sortable: true,
          filter: true,
          editable: false,
          resizable:true,
          minWidth: 100
        }
      }
      else
      {
        col = {
          flex: 1,
          field: this.zaglavlja1[i],
          sortable: true,
          filter: true,
          editable: false,
          resizable:true,
          minWidth: 100
        }
      }
      
      this.KoloneDef1.push(col);
    }
    col = {
      flex: 1,
      field: "ModelID",
      sortable: true,
      filter: true,
      editable: false,
      resizable:true,
      minWidth: 100,
      hide: true
     
    }
    this.KoloneDef1.push(col);
    var jsonString:string;
    let obj: any;
    for(let i=0;i<this.modeliZaUlogovanogKorisnika.length;i++)
    {
      jsonString='{"'+this.KoloneDef1[0].field+'":"'+this.modeliZaUlogovanogKorisnika[i].ModelName+'","'+this.KoloneDef1[1].field+'":"'+this.modeliZaUlogovanogKorisnika[i].Description+'","'+this.KoloneDef1[2].field+'":"'+this.modeliZaUlogovanogKorisnika[i].DateSaved+'","ModelID":"'+this.modeliZaUlogovanogKorisnika[i].ModelID+'"}'
      
        obj= JSON.parse(jsonString);
        
        this.RedoviPodaci1.push(obj);
    }
    

  }

  onRowSelected(event: RowSelectedEvent) {
    if(event.node.isSelected())
    {
      let form=new FormData();
      alert(event.data.ModelID);
      form.append("token",this.cookieService.get('token'));
      form.append("modelID",event.data.ModelID)
      this.http.post(this.osnovniUrl+"api/KontrolerAutorizacije/"+`${this.cookieService.get('token')}`+'/getmodelbyid',form).subscribe(
        res=>{
          console.log(res);
        },
        err=>{
          console.log(err);
        }
      )
    }
  
  }
}



