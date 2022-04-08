import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FullWidth } from 'ag-grid-community/dist/lib/components/framework/componentTypes';
import { SharedService } from '../shared-statistic/shared.service';
import { FormGroup,FormControl,Validators, FormBuilder, FormArray } from '@angular/forms';
import { any } from 'bluebird';
import {ObjekatZaSlanje} from '../trening/ObjekatZaSlanje.model'
@Component({
  selector: 'app-izbor-parametara',
  templateUrl: './izbor-parametara.component.html',
  styleUrls: ['./izbor-parametara.component.css']
})


export class IzborParametaraComponent implements OnInit {
  
  forma=new FormGroup({
    TipProblema:new FormControl('',[Validators.required]),
    MeraGreske:new FormControl('',[Validators.required]),
    MeraUspeha:new FormControl('',[Validators.required]),
    formArraylistaSkrivenihSlojeva:this.fb.array([
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
  get formArraylistaSkrivenihSlojeva() {
    return this.forma.get('formArraylistaSkrivenihSlojeva') as FormArray;
  }



  constructor(private shared: SharedService,private fb: FormBuilder) { }
  statistika:Object;
  public SelektovanaVrednost;
  trenutniBrojSkrivenihSlojeva=0;
  
  SelektovaniTipProblema;
  SelektovanaVrednostGreske;
  SelektovanaVrednostUspeha;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  dropdownList2 = [];
  izlaznaKolona;
  dropdownSettings2={};

  listaSkrivenihSlojeva=[];

  pom(){
    console.log(this.listaKolona);
  }

  //{"id":1,"itemName":"India"},
  listaKolona = [];

    ngOnInit(){
      this.statistika=this.shared.getStatistic();
      
      
      var id=0;
      interface Kolona {
        id: string;
        itemName: number;
      }
      
      for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
      {
        var pom = {} as Kolona;
        pom.id=id.toString();
        pom.itemName=this.statistika['numericke_kolone'][i]['ime_kolone'];
        
        this.listaKolona.push(pom);
        id++;
      }
      for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
      {
        var pom = {} as Kolona;
        pom.id=id.toString();
        pom.itemName=this.statistika['kategoricke_kolone'][i]['ime_kolone'];
        
        this.listaKolona.push(pom);
        id++;
      }
      this.loadDataSet1();
      this.loadDataSet2();  
                        
    } 

    // sortirajListuKolona(){
    //   this.listaKolona.sort(function (a, b) {
    //     return a.id - b.id;
    //   });
    // }

    loadDataSet1() {
      this.dropdownSettings = { 
        singleSelection: false, 
        text:"Select Countries",
        selectAllText:'Select All',
        unSelectAllText:'UnSelect All',
        enableSearchFilter: true,
        classes:"myclass custom-class",
        badgeShowLimit:"3",
        limitSelection: this.listaKolona.length-1
        
      };

      // this.sortirajListuKolona();
      this.dropdownList = [];
      for (let i = 0; i < this.listaKolona.length; ++i) {
        if(this.izlaznaKolona){
          if(this.izlaznaKolona[0]){
            if(this.listaKolona[i].id==this.izlaznaKolona[0].id){
              continue;
            }
          }
        }
            
        this.dropdownList.push(this.listaKolona[i]);
      }
  }
  loadDataSet2() {
    this.dropdownSettings2 = { 
      singleSelection: true, 
      text:"Select Countries",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class",
      showCheckbox:false

      
    };
      this.dropdownList2 = [];
      // this.sortirajListuKolona();

      for (let i = 0; i < this.listaKolona.length; ++i) {
        var stanje=true;
        for (let j = 0; j < this.selectedItems.length; ++j){
          if(this.selectedItems[j].id==this.listaKolona[i].id){
            stanje=false;
            break;
          }
        }
        if(stanje)
          this.dropdownList2.push(this.listaKolona[i]);
      }
  }

    // brisanjeElementaIzListe(item:any){
    //   this.listaKolona.forEach((element,index)=>{
    //     if(element.id==item.id) this.listaKolona.splice(index,1);
    //   });
    // }

    onItemSelect(item:any){
        
        
        this.loadDataSet2();
    }
    OnItemDeSelect(item:any){
        
        this.loadDataSet2();
    }

    onSelectAll(items: any){
        
        this.loadDataSet2();
    }
    onDeSelectAll(items: any){
        
        this.loadDataSet2();
    }
    

    onItemSelect2(item:any){
      
      this.loadDataSet1();
    }
    OnItemDeSelect2(item:any){

        this.loadDataSet1();
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
          this.listaSkrivenihSlojeva.push(pom);
          this.formArraylistaSkrivenihSlojeva.push(this.fb.group({
                                                                    BrojNeurona: [1],
                                                                    AktivacionaFunkcija: ['', Validators.required]
                                                                }))
        }
        else{
          this.trenutniBrojSkrivenihSlojeva=value;
          this.listaSkrivenihSlojeva.splice(this.listaSkrivenihSlojeva.length-1, 1);
          this.formArraylistaSkrivenihSlojeva.removeAt(this.listaSkrivenihSlojeva.length-1);
        }
        console.log(this.listaSkrivenihSlojeva);
        console.log(this.formArraylistaSkrivenihSlojeva)
        return;
      }
      if(value==0){
        this.listaSkrivenihSlojeva.splice(id, 1);
        this.formArraylistaSkrivenihSlojeva.removeAt(id);
        this.trenutniBrojSkrivenihSlojeva=this.trenutniBrojSkrivenihSlojeva-1;
      }
      console.log(this.listaSkrivenihSlojeva);
      console.log(this.formArraylistaSkrivenihSlojeva)
    }
    stampa(){
      var ParametriZaSlanje=new ObjekatZaSlanje(); 
      ParametriZaSlanje=Object.assign(new ObjekatZaSlanje(), this.forma.value);
      
      console.log(ParametriZaSlanje);
      console.log(JSON.stringify(ParametriZaSlanje));
    }

    selektujAktFunkciju(selektovanaVrednost,id){
      this.listaSkrivenihSlojeva[id].aktivacionaFunkcija=selektovanaVrednost;
    }
    
}
