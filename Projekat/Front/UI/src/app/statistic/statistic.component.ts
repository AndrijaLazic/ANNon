import { Component, OnInit,ElementRef,AfterViewInit } from '@angular/core';
import {SharedService} from "../shared-statistic/shared.service";
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import {MatButtonModule} from '@angular/material/button';
import { statisticModel,Model } from '../shared/statistic-model.model';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ContentObserver } from '@angular/cdk/observers';
import { HttpClient } from '@angular/common/http';
import { json } from 'express';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit, AfterViewInit {
  kolone=new Array();
  stats=new Array();
  checked1=false;
  checked2=false;
  kategorije=new Array();
  kategorije2=new Array();

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
  public myCharts=new Array<Chart>();
  public selected=new Array();


  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  
  ulazne=new Array();

  dropdownList2 = [];
  izlaznaKolona;
  dropdownSettings2={};
  statistika:Object;
    

  readonly baseUrl = Konfiguracija.KonfiguracijaServera.osnovniURL;
  constructor(private shared: SharedService,private route:Router,private elementRef: ElementRef,private cookie:CookieService,private modalService: NgbModal,
    private toastr:ToastrService, private http: HttpClient) { }
    
  
listaKolona=[];


ngAfterViewInit(): void {
    for(let i=0;i<this.kolone.length;i++)
        this.iscrtajGraf(this.kolone[i]);
  }
  ngOnInit(): void {
    this.getCorrelationMatrix();
    this.drawCorrelationMatrix();
    this.statistika=JSON.parse(localStorage.getItem("statistic"));
    sessionStorage.setItem("redirectTo",this.route.url);
    if(this.statistika){
       
        
        for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
        {
            this.kolone.push(this.statistika['numericke_kolone'][i]['ime_kolone']);
            
        }
        for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
        {
            this.kolone.push(this.statistika['kategoricke_kolone'][i]['ime_kolone']);
        }
        this.pocetnoStanje();
        if(this.cookie.check("params"))
        {
            var params = Object.assign(new statisticModel(),JSON.parse(this.cookie.get('params')));
            this.cekiranaUlazna = params.nizIzabranihUlaza;
            this.cekiranaIzlazna = params.nizIzabranihIzlaza;
            this.kategorije=params.kategorije;
            this.selected=params.tipovi;
            
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


    }
  }
  
  vrednost: any;

  selectChangeHandler () {
    for(let j=0;j<this.kolone.length;j++)
    {
        if(Object.keys(this.statistika['numericke_kolone']).length!=0)
        {
            for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
            {
                if(this.kolone[j]==this.statistika['numericke_kolone'][i]['ime_kolone'])
                {
                this.kategorije.push('Numericki');
                this.kategorije2.push('Numericki');
                this.prazna.push(this.statistika['numericke_kolone'][i]['broj_praznih_polja']);
                this.collapse.push(0);
                this.selected.push('one_hot');

                }

            }
        }
      
      for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
      {
        if(this.kolone[j]==this.statistika['kategoricke_kolone'][i]['ime_kolone'])
        {
            this.kategorije.push('Kategorijski');
            this.kategorije2.push('Kategorijski');
            this.prazna.push(this.statistika['kategoricke_kolone'][i]['broj_praznih_polja']);
            this.collapse.push(0);
            this.selected.push('one_hot');
        }
      }
    }

  }

  iscrtajGraf(event:any){
    this.vrednost = event;

    for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
      {
        if(this.vrednost==this.statistika['numericke_kolone'][i]['ime_kolone'])
        {
            this.myCharts[i]=new Chart(this.vrednost, {
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
                            beginAtZero: true,
                        },
                    },
                    color: 'rgba(255,255,255, 1)',
                }
            });
          
        }
      }

    for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
      {
        if(this.vrednost==this.statistika['kategoricke_kolone'][i]['ime_kolone'])
        {

            this.myCharts[i+this.statistika['numericke_kolone'].length]=new Chart(this.vrednost, {
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
            if(this.cekiranaUlazna[i])
            {
                this.dodajUModel(i);
                brojac+=1;
            } 
        for(let i=0;i<this.cekiranaIzlazna.length;i++)
            if(this.cekiranaIzlazna[i])
            {
                this.dodajUModel(i);
                brojac2+=1;
            } 
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
                this.statsModel=new statisticModel();
                this.statsModel.nizPromena=this.modelKolona;
                this.statsModel.nizUlaznih=[];
                this.statsModel.nizIzabranihUlaza = this.cekiranaUlazna;
                this.statsModel.nizIzabranihIzlaza = this.cekiranaIzlazna;
                this.statsModel.kategorije=this.kategorije;
                this.statsModel.tipovi=this.selected;
                for(let i=0;i<this.kolone.length;i++)
                    {
                        if(this.cekiranaUlazna[i])
                            this.statsModel.nizUlaznih.push(this.kolone[i]);
                        if(this.cekiranaIzlazna[i])
                            this.statsModel.izlazna=this.kolone[i];
                    }
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

  }
  prikazi(id:any){
      this.collapse[id]=1;
      for(let i=0;i<this.collapse.length;i++){
        if(i!=id && this.collapse[i]==1)
        {
            this.collapse[i]=0;
        }
            
      }
      this.checked1=false;
      this.checked2=false;
      

  }
  smanji(id:any){
        this.collapse[id]=0;
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
        this.model.tipEnkodiranja= this.selected[id];
    else
    {
        this.model.tipEnkodiranja=null;
        
    }
    this.modelKolona.push(this.model);
  
  }
  promeniUNumericki(id:any){
      this.kategorije[id]='Numericki';
  }
  promeniUKategorijski(id:any){
    this.kategorije[id]='Kategorijski';
}
    dodajUlazne(){
        for(let i=0;i<this.selectedItems.length;i++)
        {
            this.ulazne.push(this.selectedItems[i].itemName);
        }
    }

    openModalDialogCustomClass(content) {
        this.modalService.open(content);
      }


    dajUlazne(event:any,event2:any){ 
        if (event2.checked) { this.cekiranaUlazna[event]=true
                                this.cekiranaIzlazna[event]=false}
        else {this.cekiranaUlazna[event]=false}
       
    }
    dajIzlaznu(event:any,event2:any){
        if (event2.checked) {
             this.cekiranaIzlazna[event]=true;
             this.cekiranaUlazna[event]=false;
             for(let i=0;i<this.cekiranaIzlazna.length;i++)
                if(i!=event) this.cekiranaIzlazna[i]=false;
        }
        else {this.cekiranaIzlazna[event]=false}

    }

    pocetnoStanje()
    {
        for(let i = 0;i<this.kolone.length-1;i++)
        {
            this.cekiranaUlazna[i]=true;
            this.cekiranaIzlazna[i]=false;
        }
        this.cekiranaUlazna[this.kolone.length-1]=false;
        this.cekiranaIzlazna[this.kolone.length-1]=true;
    }

    getCorrelationMatrix()
    {
        const formData = new FormData();
        formData.append("sessionID",sessionStorage.getItem("userId"));
        this.http.post(this.baseUrl+"api/MachineLearning/getCorrelationMatrix",formData).subscribe(
            res => sessionStorage.setItem("correlationMatrix",JSON.stringify(res)),
            err => this.toastr.error("Greška pri izračunavanju korelacione matrice","Greška")
        );
    }

    drawCorrelationMatrix()
    {
        var getMatrix = sessionStorage.getItem("correlationMatrix");

        var correlationMatrix = JSON.parse(getMatrix) as object
        var headers = Object.keys(correlationMatrix);
        for(let i = 0; i < headers.length; i++)
        {
            console.log(headers[i])
            for(let j = 0; j < headers.length; j++)
            {
                if(i == 0)
                    console.log(headers[j]);
                else
                {
                    console.log(correlationMatrix[headers[i]][headers[j]]);
                }
            }
            
        }

        console.log(getMatrix);
        
    }



}
