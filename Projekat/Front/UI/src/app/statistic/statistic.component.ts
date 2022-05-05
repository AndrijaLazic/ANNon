import { Component, OnInit,ElementRef } from '@angular/core';
import {SharedService} from "../shared-statistic/shared.service";
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import {MatButtonModule} from '@angular/material/button';
import { statisticModel,Model } from '../shared/statistic-model.model';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ContentObserver } from '@angular/cdk/observers';
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  kolone=new Array();
  stats=new Array();
  checked1=false;
  checked2=false;
  kategorije=new Array();
  cekiranaUlazna=new Array();
  cekiranaIzlazna=new Array();
  prazna=new Array();
  collapse=new Array();
  strStat:string;
  model:Model;
  statsModel:statisticModel;
  //pomocni niz u koji se pakuju svi modeli koji su menjani
  modelKolona=new Array<Model>();

  //niz koji treba slati na back,u njemu su samo modeli cije kolone su odabrane kao ulazne ili izlazna kolona
  modelKolona2=new Array<Model>();
  public myChart: Chart;
  public selected;


  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  
  ulazne=new Array();

  dropdownList2 = [];
  izlaznaKolona;
  dropdownSettings2={};
  statistika:Object;
  
  constructor(private shared: SharedService,private route:Router,private elementRef: ElementRef,private cookie:CookieService,private modalService: NgbModal,
    private toastr:ToastrService) { }
    
  
listaKolona=[];



  ngOnInit(): void {

    this.statistika=JSON.parse(localStorage.getItem("statistic"));
    if(this.statistika){
       
        
        for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
        {
            this.kolone.push(this.statistika['numericke_kolone'][i]['ime_kolone']);
            this.cekiranaUlazna.push(false);
            this.cekiranaIzlazna.push(false);
            
        }
        for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
        {
            this.kolone.push(this.statistika['kategoricke_kolone'][i]['ime_kolone']);
            this.cekiranaUlazna.push(false);
            this.cekiranaIzlazna.push(false);
        }

        if(this.cookie.check("params"))
        {
            var params = Object.assign(new statisticModel(),JSON.parse(this.cookie.get('params')));
            this.cekiranaUlazna = params.nizIzabranihUlaza;
            this.cekiranaIzlazna = params.nizIzabranihIzlaza;
        }


        
    
        this.selectChangeHandler();
        

        var id=0;
        interface Kolona {
            id: string;
            itemName: string;
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

        //this.loadDataSet1();
        //this.loadDataSet2();  
    }
  }
  
  vrednost: any;

  selectChangeHandler () {
    //update the ui
    


    
    for(let j=0;j<this.kolone.length;j++)
    {
        if(Object.keys(this.statistika['numericke_kolone']).length!=0)
        {
            for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
            {
                if(this.kolone[j]==this.statistika['numericke_kolone'][i]['ime_kolone'])
                {
                this.kategorije.push('Numericki');
                this.prazna.push(this.statistika['numericke_kolone'][i]['broj_praznih_polja']);
                this.collapse.push(0);


                this.strStat='';
                this.strStat+='Srednja vrednost: '
                +this.statistika['numericke_kolone'][i]['prosek']+'<br>Standardna devijacija: ' +this.statistika['numericke_kolone'][i]['standardna_devijacija']+'<br>Minimum: '
                +this.statistika['numericke_kolone'][i]['minimum']+'<br>Prvi kvartal: ' +this.statistika['numericke_kolone'][i]['prvi_kvartal']+'<br>Medijana: '
                +this.statistika['numericke_kolone'][i]['drugi_kvartal']+'<br>Treci kvartal: ' +this.statistika['numericke_kolone'][i]['treci_kvartal']+'<br>Maximum: '
                +this.statistika['numericke_kolone'][i]['maximum']+'<br>Broj autlajera: ' +this.statistika['numericke_kolone'][i]['broj_autlajera'];
                this.stats.push(this.strStat);

                }

            }
        }
      
      for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
      {
        if(this.kolone[j]==this.statistika['kategoricke_kolone'][i]['ime_kolone'])
        {
            this.kategorije.push('Kategorijski');
            this.prazna.push(this.statistika['kategoricke_kolone'][i]['broj_praznih_polja']);
            this.collapse.push(0);

          this.strStat='';
          this.strStat+='Broj jedinstvenih polja: '
          +this.statistika['kategoricke_kolone'][i]['broj_jedinstvenih_polja']+'<br>Najcesca vrednost: ' +this.statistika['kategoricke_kolone'][i]['najcesca_vrednost']+'<br>Najveci broj ponavljanja: '
          +this.statistika['kategoricke_kolone'][i]['najveci_broj_ponavljanja'];
          this.stats.push(this.strStat);

        }
      }
    }
    console.log(this.collapse);

    
  }

  iscrtajGraf(event:any,event2:any,event3:any){
    this.vrednost = event;
    if(event3==1)
        this.checked1=event2.checked;
    if(event3==2)
        this.checked2=event2.checked;

    console.log(this.checked1,this.checked2);
    for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
      {
        if(this.vrednost==this.statistika['numericke_kolone'][i]['ime_kolone'])
        {
            if (this.myChart) 
                this.myChart.destroy();
          //graf
          if(this.checked1==false && this.checked2==false)
          {
              this.myChart.destroy;
          }
          else if(this.checked1==true && this.checked2==false)
          {
            this.myChart=new Chart(this.vrednost, {
                type: 'line',
                data: {
                    labels: Object.keys(this.statistika['numericke_kolone'][i]['column_chart_data']) ,
                    datasets: [{
                        label: 'Broj redova',
                        tension: 0.5,
                        data: Object.values(this.statistika['numericke_kolone'][i]['column_chart_data']),
                    }  
                ]
                },
                options: {
                    scales: {
                        
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
          }
          else if(this.checked1==false && this.checked2==true)
          {
            this.myChart=new Chart(this.vrednost, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.statistika['numericke_kolone'][i]['column_chart_data']) ,
                    datasets: [{
                        label: 'Broj redova',
                        data: Object.values(this.statistika['numericke_kolone'][i]['column_chart_data']),
                    }  
                ]
                },
                options: {
                    scales: {
                        
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
          }
          else
          {
            this.myChart=new Chart(this.vrednost, {
                type: 'line',
                data: {
                    labels: Object.keys(this.statistika['numericke_kolone'][i]['column_chart_data']) ,
                    datasets: [{
                        type:'line',
                        label: 'Broj redova',
                        tension: 0.5,
                        data: Object.values(this.statistika['numericke_kolone'][i]['column_chart_data']),
                    },
                    {
                        type:'bar',
                        label: 'Broj redova',
                        data: Object.values(this.statistika['numericke_kolone'][i]['column_chart_data']),
                    }
                
                ]
                },
                options: {
                    scales: {
                        
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
          }

        }
      }



    for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
      {
        if(this.vrednost==this.statistika['kategoricke_kolone'][i]['ime_kolone'])
        {
            if (this.myChart) 
                this.myChart.destroy();
          //graf
          if(this.checked1==false && this.checked2==false)
          {
              this.myChart.destroy;
          }
          else if(this.checked1==true && this.checked2==false)
          {
            this.myChart=new Chart(this.vrednost, {
                type: 'line',
                data: {
                    labels: Object.keys(this.statistika['kategoricke_kolone'][i]['column_chart_data']) ,
                    datasets: [{
                        label: 'Broj redova',
                        tension: 0.5,
                        data: Object.values(this.statistika['kategoricke_kolone'][i]['column_chart_data']),
                    }  
                ]
                },
                options: {
                    scales: {
                        
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
          }
          else if(this.checked1==false && this.checked2==true)
          {
            this.myChart=new Chart(this.vrednost, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.statistika['kategoricke_kolone'][i]['column_chart_data']) ,
                    datasets: [{
                        label: 'Broj redova',
                        data: Object.values(this.statistika['kategoricke_kolone'][i]['column_chart_data']),
                    }  
                ]
                },
                options: {
                    scales: {
                        
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
          }
          else
          {
            this.myChart=new Chart(this.vrednost, {
                type: 'line',
                data: {
                    labels: Object.keys(this.statistika['kategoricke_kolone'][i]['column_chart_data']) ,
                    datasets: [{
                        type:'line',
                        label: 'Broj redova',
                        tension: 0.5,
                        data: Object.values(this.statistika['kategoricke_kolone'][i]['column_chart_data']),
                    },
                    {
                        type:'bar',
                        label: 'Broj redova',
                        data: Object.values(this.statistika['kategoricke_kolone'][i]['column_chart_data']),
                    }
                
                ]
                },
                options: {
                    scales: {
                        
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
          }
        }
      }

  }
  previous()
  {
    if(window.confirm('Da li ste sigurni da zelite da se vratite na prethodnu stranu?'))
    {
        this.route.navigate(['./pocetna']);
    }
    
  }
  next()
  {
        this.dodajUlazne;
        let brojac=0;
        let brojac2=0;
        for(let i=0;i<this.cekiranaUlazna.length;i++)
            if(this.cekiranaUlazna[i]) brojac+=1;
        for(let i=0;i<this.cekiranaIzlazna.length;i++)
            if(this.cekiranaIzlazna[i]) brojac2+=1;
        if(brojac==0)
        {
            this.toastr.warning("Niste uneli ulazne kolone!");
        }
        else
        {
            if(brojac2==0)
                this.toastr.warning("Niste uneli izlaznu kolonu!");
            else
            {
                for(let j=0;j<this.modelKolona.length;j++)
                {
                    for(let i=0;i<this.selectedItems.length;i++)
                    {
                        if(this.modelKolona[j].nazivKolone==this.selectedItems[i].itemName)
                        {
                            this.modelKolona2.push(this.modelKolona[j]);
                        }
                    }
                    if(this.modelKolona[j].nazivKolone==this.izlaznaKolona[0].itemName)
                    {
                        this.modelKolona2.push(this.modelKolona[j]);
                    }
                }
                this.statsModel=new statisticModel();
                this.statsModel.nizPromena=this.modelKolona2;
                this.statsModel.nizUlaznih=[];
                console.log(this.cekiranaIzlazna);
                this.statsModel.nizIzabranihUlaza = this.cekiranaUlazna;
                this.statsModel.nizIzabranihIzlaza = this.cekiranaIzlazna;
                for(let i=0;i<this.kolone.length;i++)
                    {
                        if(this.cekiranaUlazna[i])
                            this.statsModel.nizUlaznih.push(this.kolone[i]);
                        if(this.cekiranaIzlazna[i])
                            this.statsModel.izlazna=this.kolone[i];
                    }
                console.log(this.statsModel.nizUlaznih);
                //this.statsModel.izlazna=this.izlaznaKolona[0].itemName;
                this.cookie.set('params',JSON.stringify(this.statsModel));
    
    
                
    
                this.route.navigate(['./training']);
            }

        }
            


    
  }

  obrisi(id:any){
        for(let i=0;i<this.selectedItems.length;i++)
        {
            if(this.kolone[id]==this.selectedItems[i].itemName)
            {
                this.selectedItems.splice(i,1);
            }
        }
        if(this.izlaznaKolona)
            if(typeof this.izlaznaKolona[0]!="undefined")
                if(this.kolone[id]==this.izlaznaKolona[0].itemName)
                {
                    this.izlaznaKolona.splice(0,1);
                }
        
        this.kolone.splice(id,1);
        this.prazna.splice(id,1);
        this.kategorije.splice(id,1);
        this.stats.splice(id,1);
        this.collapse.splice(id,1);
        this.listaKolona.splice(id,1);


        //this.loadDataSet1();
        //this.loadDataSet2();  
        
        
    
    


  }
  prikazi(id:any){
      this.collapse[id]=1;
      for(let i=0;i<this.collapse.length;i++){
        if(i!=id && this.collapse[i]==1)
        {
                this.dodajUModel(i);
                this.collapse[i]=0;
            
            
        } 
      }
      this.checked1=false;
      this.checked2=false;

  }
  smanji(id:any){
        this.collapse[id]=0;
        this.dodajUModel(id);

      
  }
  dodajUModel(id:any){
    for(let i=0;i<this.modelKolona.length;i++)
    {
        if(this.modelKolona[i].nazivKolone==this.kolone[id])
        {
            this.modelKolona.splice(i,1);
        }
    }
    this.model=new Model();
    this.model.nazivKolone=this.kolone[id];
    this.model.tipPodataka=this.kategorije[id];
    if(this.kategorije[id]=='Kategorijski')
        this.model.tipEnkodiranja= this.selected;
    else
    {
        this.model.tipEnkodiranja=null;
        this.modelKolona.push(this.model);
    }
    if(this.selected!=null)
        this.modelKolona.push(this.model);
    console.log(this.modelKolona);
    this.selected=null;

    console.log(this.selectedItems,this.izlaznaKolona);


      
  }
  promeniUNumericki(id:any){
      this.kategorije[id]='Numericki';
  }
  promeniUKategorijski(id:any){
    this.kategorije[id]='Kategorijski';
}

    /*loadDataSet1() {
        this.dropdownSettings = { 
        singleSelection: false, 
        text:"",
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
        text:"",
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
    } */

    dodajUlazne(){
        for(let i=0;i<this.selectedItems.length;i++)
        {
            this.ulazne.push(this.selectedItems[i].itemName);
        }
    }

    openModalDialogCustomClass(content) {
        this.modalService.open(content);
      }


    dajUlazne(event:any){
        let element = <HTMLInputElement> document.getElementById(event);  
        if (element.checked) { this.cekiranaUlazna[event]=true}
        else {this.cekiranaUlazna[event]=false}
        console.log(this.cekiranaUlazna);
        
    }
    dajIzlaznu(event:any){
        let element = <HTMLInputElement> document.getElementById("izlazna"+event);  
        if (element.checked) {
             this.cekiranaIzlazna[event]=true;
             for(let i=0;i<this.cekiranaIzlazna.length;i++)
                if(i!=event) this.cekiranaIzlazna[i]=false;
        }
        else {this.cekiranaIzlazna[event]=false}

    }


}
