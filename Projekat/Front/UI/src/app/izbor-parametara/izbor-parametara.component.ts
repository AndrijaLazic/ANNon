import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FullWidth } from 'ag-grid-community/dist/lib/components/framework/componentTypes';
import { SharedService } from '../shared-statistic/shared.service';
import { FormGroup,FormControl,Validators, FormBuilder, FormArray } from '@angular/forms';
import { any } from 'bluebird';
import {ObjekatZaSlanje} from '../trening/ObjekatZaSlanje.model'
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-izbor-parametara',
  templateUrl: './izbor-parametara.component.html',
  styleUrls: ['./izbor-parametara.component.css']
})


export class IzborParametaraComponent implements OnInit {

  MinBrojEpoha=5;
  MaxBrojEpoha=300;
  //slajder
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
  @ViewChild('FormaZaHParametre') FormaZaHParametre;

  forma=new FormGroup({
    TipProblema:new FormControl('',[Validators.required]),
    MeraGreske:new FormControl('',[Validators.required]),
    MeraUspeha:new FormControl('',[Validators.required]),
    BrojEpoha:new FormControl(5,[Validators.required,Validators.min(this.MinBrojEpoha),Validators.max(this.MaxBrojEpoha)]),
    odnosPodataka:new FormControl(25),
    ListaSkrivenihSlojeva:this.fb.array([
    ])
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



  constructor(private fb: FormBuilder) { }
  trenutniBrojSkrivenihSlojeva=0;

  

    ngOnInit(){ 
    }


    change(value: any,id:any): void {
      interface SkriveniSloj{
        brojNeurona:number;
        aktivacionaFunkcija:string;
      }
      
      if(id==-1){
        if(value>this.trenutniBrojSkrivenihSlojeva){
          this.trenutniBrojSkrivenihSlojeva=value;
          var pom = {} as SkriveniSloj;
          pom.brojNeurona=1;
          
          this.ListaSkrivenihSlojeva.push(this.fb.group({
                                                                    BrojNeurona: [1],
                                                                    AktivacionaFunkcija: ['', Validators.required]
                                                                }))
        }
        else{
          this.trenutniBrojSkrivenihSlojeva=value;
          
          this.ListaSkrivenihSlojeva.removeAt(this.ListaSkrivenihSlojeva.length-1);
        }
        
        
        return;
      }
      if(value==0){
        
        this.ListaSkrivenihSlojeva.removeAt(id);
        this.trenutniBrojSkrivenihSlojeva=this.trenutniBrojSkrivenihSlojeva-1;
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
    
    
}
