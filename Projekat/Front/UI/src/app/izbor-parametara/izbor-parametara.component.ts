import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FullWidth } from 'ag-grid-community/dist/lib/components/framework/componentTypes';
import { SharedService } from '../shared-statistic/shared.service';
import { FormGroup,FormControl,Validators, FormBuilder, FormArray } from '@angular/forms';
import { any } from 'bluebird';
import {ObjekatZaSlanje} from '../trening/ObjekatZaSlanje.model'
import { Options } from '@angular-slider/ngx-slider';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-izbor-parametara',
  templateUrl: './izbor-parametara.component.html',
  styleUrls: ['./izbor-parametara.component.css']
})


export class IzborParametaraComponent implements OnInit {
  klasifikacija:boolean=false;
  regresija:boolean=false;
  binarna_klasifikacija:boolean=false;
  MinBrojEpoha=5;
  MaxBrojEpoha=300;
  //slajder
  minBrojSkrivenihSlojeva:number=1;
  maxBrojSkrivenihSlojeva:number=10;
  value: number = 12;
  options: Options = {
    floor: 10,
    ceil: 90,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      // if (value <= 30) {
      //     return 'red';
      // }
      // if (value <= 60) {
      //     return 'orange';
      // }
      // if (value <= 80) {
      //     return 'yellow';
      // }
      return '#00B38F';
    },
    getPointerColor: (value: number): string => {
      // if (value <= 30) {
      //     return 'red';
      // }
      // if (value <= 60) {
      //     return 'orange';
      // }
      // if (value <= 80) {
      //     return 'yellow';
      // }
      return '#00B38F';
    },
    translate: (value: number): string => {
      return value+"%";
    }
  };


  //forma
  @Output() newItemEvent = new EventEmitter<ObjekatZaSlanje>();
  @Output() novaMeraGreskeEvent = new EventEmitter<string>();
  @ViewChild('FormaZaHParametre') FormaZaHParametre;

  forma=new FormGroup({
    TipProblema:new FormControl('',[Validators.required]),
    MeraGreske:new FormControl('',[Validators.required]),
    MeraUspeha:new FormControl('',[Validators.required]),
    BrojEpoha:new FormControl(5,[Validators.required,Validators.min(this.MinBrojEpoha),Validators.max(this.MaxBrojEpoha)]),
    odnosPodataka:new FormControl(),
    ListaSkrivenihSlojeva:this.fb.array([]),
    StopaUcenja:new FormControl(1,[Validators.required]),
    VelicinaBatch:new FormControl(1,[Validators.required])
  })
  get TipProblema(){
    return this.forma.get('TipProblema');
  }
  get MeraGreske(){
    return this.forma.get('MeraGreske');
  }
  get MeraUspeha(){
    return this.forma.get('MeraUspeha');
  }
  get ListaSkrivenihSlojeva() {
    return this.forma.get('ListaSkrivenihSlojeva') as FormArray;
  }
  get BrojEpoha() {
    return this.forma.get('BrojEpoha');
  }
  get StopaUcenja() {
    return this.forma.get('StopaUcenja');
  }
  get VelicinaBatch() {
    return this.forma.get('VelicinaBatch');
  }

  


  forma2=new FormGroup({
    trenutniBrojSkrivenihSlojeva:new FormControl(1,[Validators.required])
  })
  get trenutniBrojSkrivenihSlojeva(){
    return this.forma2.get('trenutniBrojSkrivenihSlojeva');
  }

  constructor(private fb: FormBuilder,private cookie:CookieService,private cookieService:CookieService) {
    
   }
  

  

    ngOnInit(){ 
      let pom=JSON.parse(this.cookie.get('params'));
      if(sessionStorage.getItem('redirectTo')=="/statistic")
      {
        this.Provera();
      }
      //napraviti Funkciju!!
      if(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
      {
        let pom1=JSON.parse(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
        this.forma.controls["StopaUcenja"].setValue(pom1['StopaUcenja']);
        this.forma.controls["VelicinaBatch"].setValue(pom1['VelicinaBatch']);
        if(pom1['TipProblema']=="regresija")
        {
            this.novaMeraGreskeEvent.emit("Srednja kvadratna greška");
            this.klasifikacija=true;
            this.binarna_klasifikacija=true;
        }
        if(pom1['TipProblema']=="klasifikacija")
        {
            this.novaMeraGreskeEvent.emit("Kategorijska krosentropija");
            this.regresija=true;
            this.binarna_klasifikacija=true;
        }
        if(pom1['TipProblema']=="binarna_klasifikacija")
        {
            this.novaMeraGreskeEvent.emit("Binarna krosentropija");
            this.regresija=true;
            this.klasifikacija=true;
        }
        this.forma.patchValue({
          TipProblema:pom1['TipProblema'],
          MeraGreske:pom1['MeraGreske'],
          MeraUspeha:pom1['MeraUspeha'],
          odnosPodataka:pom1['odnosPodataka'],
          BrojEpoha:pom1['BrojEpoha']
        });
        this.forma2.controls['trenutniBrojSkrivenihSlojeva'].setValue(pom1['BrojSlojeva']);
        for(let i=0;i<pom1['ListaSkrivenihSlojeva'].length;i++)
        {
          this.ListaSkrivenihSlojeva.push(this.fb.group({
            BrojNeurona: [pom1['ListaSkrivenihSlojeva'][i]['BrojNeurona'],[Validators.required,Validators.min(0),Validators.max(8)]],
            AktivacionaFunkcija: [pom1['ListaSkrivenihSlojeva'][i]['AktivacionaFunkcija'], Validators.required]
        }))
        }
        
      }

      else
      {
        this.forma.controls["StopaUcenja"].setValue("0.001");
        this.forma.controls["VelicinaBatch"].setValue("32");
        for(let i=0;i<pom['nizIzabranihIzlaza'].length;i++)
        {
          if(pom['nizIzabranihIzlaza'][i])
          {
            if(pom['kategorije'][i]=="Numericki")
            {
                this.forma.patchValue({
                  TipProblema:'regresija',
                  MeraGreske:'mean_squared_error',
                  MeraUspeha:'mean_squared_error',
                  odnosPodataka:25
                });
                this.novaMeraGreskeEvent.emit("Srednja kvadratna greška");
                this.klasifikacija=true;
                this.binarna_klasifikacija=true;
            }
            else
            {
              let pom2=JSON.parse(localStorage.getItem("statistic"))
              let nadjeno=false;
              for(let j=0;j<pom2['kategoricke_kolone'].length;j++)
              {
                if(pom2["kategoricke_kolone"][j]["ime_kolone"]==pom["izlazna"])
                {
                  nadjeno=true;
                  if(pom2["kategoricke_kolone"][j]["broj_jedinstvenih_polja"]>2)
                  {
                    this.forma.patchValue({
                      TipProblema:'klasifikacija',
                      MeraGreske:'categorical_crossentropy',
                      MeraUspeha:'accuracy',
                      odnosPodataka:25
                    });
                    this.novaMeraGreskeEvent.emit("Kategorijska krosentropija");
                    this.regresija=true;
                    this.binarna_klasifikacija=true;
                  }
                  else{
                    this.forma.patchValue({
                      TipProblema:'binarna_klasifikacija',
                      MeraGreske:'binary_crossentropy',
                      MeraUspeha:'accuracy',
                      odnosPodataka:25
                    });
                    this.novaMeraGreskeEvent.emit("Binarna krosentropija");
                    this.regresija=true;
                    this.klasifikacija=true;
                  }
                  break;
                }
              }
              if(!nadjeno)
              {
                this.forma.patchValue({
                  TipProblema:'klasifikacija',
                  MeraGreske:'categorical_crossentropy',
                  MeraUspeha:'accuracy',
                  odnosPodataka:25
                });
                this.novaMeraGreskeEvent.emit("Kategorijska krosentropija");
                this.regresija=true;
                this.binarna_klasifikacija=true;
              }
            }
            this.forma2.controls['trenutniBrojSkrivenihSlojeva'].setValue(1);
            this.ListaSkrivenihSlojeva.push(this.fb.group({
              BrojNeurona: [1,[Validators.required,Validators.min(0),Validators.max(8)]],
              AktivacionaFunkcija: ['relu', Validators.required]
          }))
            return;
          }
        }
      }
      
      
      
    }


    change(value: any,id:any): void {
      
      // if(value==null){
      //   this.forma2.controls['trenutniBrojSkrivenihSlojeva'].setValue(value);
      //   return
      // }

      value=parseInt(value);
      interface SkriveniSloj{
        brojNeurona:number;
        aktivacionaFunkcija:string;
      }
      
      if(id==-2){
        this.forma2.controls['trenutniBrojSkrivenihSlojeva'].setValue(value);
        return;
      }

      
      if(id==-1){
        if(value>this.maxBrojSkrivenihSlojeva){
          value=this.maxBrojSkrivenihSlojeva;
          this.forma2.controls['trenutniBrojSkrivenihSlojeva'].setValue(value);
        }
        else if(value<this.minBrojSkrivenihSlojeva){
          value=this.minBrojSkrivenihSlojeva;
          this.forma2.controls['trenutniBrojSkrivenihSlojeva'].setValue(value);
        }


        if(value>this.ListaSkrivenihSlojeva.length){
          var pom = {} as SkriveniSloj;
          pom.brojNeurona=1;
          for(let i=this.ListaSkrivenihSlojeva.length;i<value;i++){
            this.ListaSkrivenihSlojeva.push(this.fb.group({
              BrojNeurona: [1,[Validators.required,Validators.min(0),Validators.max(8)]],
              AktivacionaFunkcija: ['relu', Validators.required]
            }))
          }
          
        }
        else if(value<this.ListaSkrivenihSlojeva.length){
          
          for(let i=this.ListaSkrivenihSlojeva.length;i>value;i--){
            this.ListaSkrivenihSlojeva.removeAt(this.ListaSkrivenihSlojeva.length-1);
          }
          
        }
        
        
        return;
      }
      


      //za pojedinacne selektore
      if(value==0){
        
        this.ListaSkrivenihSlojeva.removeAt(id);
        this.forma2.controls['trenutniBrojSkrivenihSlojeva'].setValue(this.ListaSkrivenihSlojeva.length);
        return;
      }

      if(id>=0){
        
        if(!value){
          const particularsList = this.ListaSkrivenihSlojeva;
          const particularGroup = particularsList.controls[id] as FormGroup;

          const quantity = particularGroup.get('BrojNeurona');
          quantity?.setValue(1);
          
          return;
        }
      }


      

      if(value>8){
        value=8;
        const particularsList = this.ListaSkrivenihSlojeva;
        const particularGroup = particularsList.controls[id] as FormGroup;

        const quantity = particularGroup.get('BrojNeurona');
        quantity?.setValue(8);
        
      }
      else if(value<0){
        value=1;
        const particularsList = this.ListaSkrivenihSlojeva;
        const particularGroup = particularsList.controls[id] as FormGroup;

        const quantity = particularGroup.get('BrojNeurona');
        quantity?.setValue(1);
      }
      
      
    }
    dajParametre(){
      this.forma.markAllAsTouched();
      if(this.forma.invalid){
        // this.FormaZaHParametre.nativeElement.submit();
        this.newItemEvent.emit(null);
      }
      else{
        var ParametriZaSlanje=new ObjekatZaSlanje(); 
        ParametriZaSlanje=Object.assign(new ObjekatZaSlanje(), this.forma.value);
        ParametriZaSlanje.BrojSlojeva=this.ListaSkrivenihSlojeva.length;
        //console.log(ParametriZaSlanje)
        this.newItemEvent.emit(ParametriZaSlanje);
      }

    }
    

    public updateMeraGreske(event: MatSelectChange){
      this.novaMeraGreskeEvent.emit(event.source.triggerValue);
    }

    Provera()
    {
      if(localStorage.getItem('izabrani-parametri-za-istreniran-model'))
      {
        let parametri=JSON.parse(this.cookieService.get('params'))
        let brojac=0;
        let parametriSacuvani=JSON.parse(localStorage.getItem('izabrani-parametri-za-istreniran-model'));
        if(parametriSacuvani['IzlaznaKolona']==parametri['izlazna'])
        {
          if(parametriSacuvani['UlazneKolone'].length==parametri['nizUlaznih'].length)
          {
            for(let i=0;i<parametriSacuvani['UlazneKolone'].length;i++)
            {
              if(parametriSacuvani['UlazneKolone'][i]!=parametri['nizUlaznih'][i])
              {
                localStorage.removeItem('izabrani-parametri-za-istreniran-model');
                return;
              }
            }
          }
          else
          {
            localStorage.removeItem('izabrani-parametri-za-istreniran-model');
            return;
          }
        }
        else
        {
          localStorage.removeItem('izabrani-parametri-za-istreniran-model');
          return;
        }
      }
    }
    
}
