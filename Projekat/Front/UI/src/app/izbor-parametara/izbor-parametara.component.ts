import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FullWidth } from 'ag-grid-community/dist/lib/components/framework/componentTypes';
@Component({
  selector: 'app-izbor-parametara',
  templateUrl: './izbor-parametara.component.html',
  styleUrls: ['./izbor-parametara.component.css']
})
export class IzborParametaraComponent implements OnInit {

  constructor() { }
  public SelektovanaVrednost;
  trenutniBrojSkrivenihSlojeva=0;
  listaSlojeva=[];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  dropdownList2 = [];
  izlaznaKolona;
  dropdownSettings2={};

  pom(){
    console.log(this.listaKolona);
  }


  listaKolona = [
                            {"id":1,"itemName":"India"},
                            {"id":2,"itemName":"Singapore"},
                            {"id":3,"itemName":"Australia"},
                            {"id":4,"itemName":"Canada"},
                            {"id":5,"itemName":"South Korea"},
                            {"id":6,"itemName":"Germany"},
                            {"id":7,"itemName":"France"},
                            {"id":8,"itemName":"Russia"},
                            {"id":9,"itemName":"Italy"},
                            {"id":10,"itemName":"Sweden"}
                          ];

    ngOnInit(){
      
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

    change(value: any): void {
      let myContainer = <HTMLElement>document.getElementById('TreciRed');
        
      if(value>this.trenutniBrojSkrivenihSlojeva){
        this.trenutniBrojSkrivenihSlojeva=value;
        this.listaSlojeva.push(1)

        myContainer.innerHTML = myContainer.innerHTML+"<div class='col-md-auto' id='BrojNeuronaSloja'> "+
        "<label>Izaberi broj neurona</label> "+
        "<ngx-number-spinner "+
            "[value]='0' "+
            "(change)='change($event)' "+
            "[min]='0' "+
            "[max]='5'> "+
        "</ngx-number-spinner> "+
      "</div> ";
      }
      else{
        this.trenutniBrojSkrivenihSlojeva=value;
        this.listaSlojeva.splice(this.listaSlojeva.length-1, 1);
        
      }
      console.log(this.listaSlojeva);
    }


    
}
