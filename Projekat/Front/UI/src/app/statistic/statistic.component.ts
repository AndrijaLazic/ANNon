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
import { NumberValueAccessor } from '@angular/forms';
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
  headers=[];
  redMatrice=[];
  matricaZaKor=[];
  dropdownSettings2={};
  statistika:Object;
  correlationMatrix:Object;
  /*statistika={
    "numericke_kolone": [
        {
            "ime_kolone": "Carat",
            "broj_praznih_polja": 0.0,
            "prosek": 0.8,
            "standardna_devijacija": 0.47,
            "minimum": 0.2,
            "prvi_kvartal": 0.4,
            "drugi_kvartal": 0.7,
            "treci_kvartal": 1.04,
            "maximum": 5.01,
            "broj_autlajera": 439,
            "column_chart_data": {
                "0.4": 25155,
                "0.9": 18626,
                "1.4": 7129,
                "1.9": 2349,
                "2.4": 614,
                "2.8": 53,
                "3.3": 6,
                "3.8": 5,
                "4.3": 2,
                "4.8": 1
            }
        },
        {
            "ime_kolone": "Depth",
            "broj_praznih_polja": 3.0,
            "prosek": 61.75,
            "standardna_devijacija": 1.43,
            "minimum": 43.0,
            "prvi_kvartal": 61.0,
            "drugi_kvartal": 61.8,
            "treci_kvartal": 62.5,
            "maximum": 79.0,
            "broj_autlajera": 0,
            "column_chart_data": {
                "62.8": 39262,
                "59.2": 13245,
                "66.4": 1032,
                "55.6": 303,
                "70.0": 74,
                "52.0": 12,
                "44.8": 3,
                "73.6": 3,
                "77.2": 3,
                "48.4": 0
            }
        },
        {
            "ime_kolone": "Table",
            "broj_praznih_polja": 0.0,
            "prosek": 57.46,
            "standardna_devijacija": 2.23,
            "minimum": 43.0,
            "prvi_kvartal": 56.0,
            "drugi_kvartal": 57.0,
            "treci_kvartal": 59.0,
            "maximum": 95.0,
            "broj_autlajera": 336,
            "column_chart_data": {
                "56.0": 37549,
                "61.2": 15131,
                "50.8": 669,
                "66.4": 572,
                "71.6": 14,
                "45.6": 2,
                "76.8": 2,
                "92.4": 1,
                "82.0": 0,
                "87.2": 0
            }
        },
        {
            "ime_kolone": "Price",
            "broj_praznih_polja": 0.0,
            "prosek": 3932.8,
            "standardna_devijacija": 3989.44,
            "minimum": 326.0,
            "prvi_kvartal": 950.0,
            "drugi_kvartal": 2401.0,
            "treci_kvartal": 5324.25,
            "maximum": 18823.0,
            "broj_autlajera": 1206,
            "column_chart_data": {
                "1241.6": 25335,
                "3100.6": 9328,
                "4950.2": 7393,
                "6800.0": 3878,
                "8649.6": 2364,
                "10499.4": 1745,
                "12349.0": 1306,
                "14198.8": 1002,
                "16048.4": 863,
                "17898.2": 726
            }
        },
        {
            "ime_kolone": "X",
            "broj_praznih_polja": 0.0,
            "prosek": 5.73,
            "standardna_devijacija": 1.12,
            "minimum": 0.0,
            "prvi_kvartal": 4.71,
            "drugi_kvartal": 5.7,
            "treci_kvartal": 6.54,
            "maximum": 10.74,
            "broj_autlajera": 43,
            "column_chart_data": {
                "4.8": 20895,
                "5.9": 14440,
                "7.0": 12205,
                "8.1": 3260,
                "3.8": 2934,
                "9.1": 191,
                "0.5": 8,
                "10.2": 7,
                "1.6": 0,
                "2.7": 0
            }
        },
        {
            "ime_kolone": "Y",
            "broj_praznih_polja": 0.0,
            "prosek": 5.73,
            "standardna_devijacija": 1.14,
            "minimum": 0.0,
            "prvi_kvartal": 4.72,
            "drugi_kvartal": 5.71,
            "treci_kvartal": 6.54,
            "maximum": 58.9,
            "broj_autlajera": 34,
            "column_chart_data": {
                "2.9": 30633,
                "8.8": 23305,
                "32.4": 1,
                "56.0": 1,
                "14.7": 0,
                "20.6": 0,
                "26.5": 0,
                "38.3": 0,
                "44.2": 0,
                "50.1": 0
            }
        },
        {
            "ime_kolone": "Z",
            "broj_praznih_polja": 0.0,
            "prosek": 3.54,
            "standardna_devijacija": 0.71,
            "minimum": 0.0,
            "prvi_kvartal": 2.91,
            "drugi_kvartal": 3.53,
            "treci_kvartal": 4.04,
            "maximum": 31.8,
            "broj_autlajera": 55,
            "column_chart_data": {
                "4.8": 33983,
                "1.6": 19951,
                "8.0": 5,
                "30.2": 1,
                "11.1": 0,
                "14.3": 0,
                "17.5": 0,
                "20.7": 0,
                "23.8": 0,
                "27.0": 0
            }
        }
    ],
    "kategoricke_kolone": [
        {
            "ime_kolone": "Cut",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 5,
            "najcesca_vrednost": "Ideal",
            "najveci_broj_ponavljanja": 21551,
            "column_chart_data": {
                "Ideal": 21551,
                "Premium": 13791,
                "Very Good": 12082,
                "Good": 4906,
                "Fair": 1610
            }
        },
        {
            "ime_kolone": "Color",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 7,
            "najcesca_vrednost": "G",
            "najveci_broj_ponavljanja": 11292,
            "column_chart_data": {
                "G": 11292,
                "E": 9797,
                "F": 9542,
                "H": 8304,
                "D": 6775,
                "I": 5422,
                "J": 2808
            }
        },
        {
            "ime_kolone": "Clarity",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 8,
            "najcesca_vrednost": "SI1",
            "najveci_broj_ponavljanja": 13065,
            "column_chart_data": {
                "SI1": 13065,
                "VS2": 12258,
                "SI2": 9194,
                "VS1": 8171,
                "VVS2": 5066,
                "VVS1": 3655,
                "others(2)": 2531
            }
        }
    ]
};

  
  correlationMatrix={"carat":{"carat":1,"depth":0.0282243143,"table":0.1816175465,"price":0.9215913012,"x":0.9750942267,"y":0.951722199,"z":0.9533873806},
  "depth":{"carat":0.0282243143,"depth":1,"table":-0.2957785215,"price":-0.0106474046,"x":-0.025289247,"y":-0.0293406707,"z":0.0949238824},
  "table":{"carat":0.1816175465,"depth":-0.2957785215,"table":1,"price":0.1271339021,"x":0.195344281,"y":0.1837601471,"z":0.1509286916},
  "price":{"carat":0.9215913012,"depth":-0.0106474046,"table":0.1271339021,"price":1,"x":0.884435161,"y":0.8654208979,"z":0.8612494439},
  "x":{"carat":0.9750942267,"depth":-0.025289247,"table":0.195344281,"price":0.884435161,"x":1,"y":0.9747014797,"z":0.9707717986},
  "y":{"carat":0.951722199,"depth":-0.0293406707,"table":0.1837601471,"price":0.8654208979,"x":0.9747014797,"y":1,"z":0.9520057162},
  "z":{"carat":0.9533873806,"depth":0.0949238824,"table":0.1509286916,"price":0.8612494439,"x":0.9707717986,"y":0.9520057162,"z":1}}; */

    

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
    
    //this.drawCorrelationMatrix();
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
        this.route.navigate(['./fileUpload']);
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

    VidljivostKorMatrice=false;
    getCorrelationMatrix()
    {
        const formData = new FormData();
        formData.append("sessionID",sessionStorage.getItem("userId"));
        this.http.post(this.baseUrl+"api/MachineLearning/getCorrelationMatrix",formData).subscribe(
            res => {
                sessionStorage.setItem("correlationMatrix",JSON.stringify(res))
                this.VidljivostKorMatrice=true;
                this.correlationMatrix = JSON.parse(sessionStorage.getItem("correlationMatrix"));
                this.podaciZaMatricu();
        },
            err => this.toastr.error("Greška pri izračunavanju korelacione matrice","Greška")
        );
    }

    /*drawCorrelationMatrix()
    {
        var getMatrix = sessionStorage.getItem("correlationMatrix");

        this.correlationMatrix = JSON.parse(getMatrix) as object
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
        
    }*/
    podaciZaMatricu()
    {
        this.headers=Object.keys(this.correlationMatrix);
        //console.log(Object.keys(this.correlationMatrix));
        for(let i=0;i<this.headers.length;i++)
        {
            //console.log(Object.values(this.correlationMatrix[Object.keys(this.correlationMatrix)[i]]));
            this.redMatrice.push(Object.keys(this.correlationMatrix)[i]);
            for(let j=0;j<Object.values(this.correlationMatrix[Object.keys(this.correlationMatrix)[i]]).length;j++){
                var number = Object.values(this.correlationMatrix[Object.keys(this.correlationMatrix)[i]])[j] as number;
                this.redMatrice.push(number.toFixed(3));
            }

            this.matricaZaKor.push(this.redMatrice);
            this.redMatrice=[];
        }
        console.log(this.matricaZaKor);
        
        
    }



}
