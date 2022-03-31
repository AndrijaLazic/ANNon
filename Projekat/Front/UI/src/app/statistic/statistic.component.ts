import { Component, OnInit,ElementRef } from '@angular/core';
import {SharedService} from "../shared-statistic/shared.service";
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  kolone=new Array();
  stats=new Array();
  strStat:string;
  myChart;
  constructor(private shared: SharedService,private route:Router,private elementRef: ElementRef) { }
    statistika:Object;
  /*statistika={
    "numericke_kolone": [
        {
            "ime_kolone": "PassengerId",
            "broj_praznih_polja": 0.0,
            "prosek": 446.0,
            "standardna_devijacija": 257.3538420152301,
            "minimum": 1.0,
            "prvi_kvartal": 223.5,
            "drugi_kvartal": 446.0,
            "treci_kvartal": 668.5,
            "maximum": 891.0,
            "broj_autlajera": 0,
            "column_chart_data": {
                "(0.11, 128.143]": 300,
                "(763.857, 891.0]": 128,
                "(128.143, 255.286]": 127,
                "(255.286, 382.429]": 127,
                "(382.429, 509.571]": 127,
                "(509.571, 636.714]": 127,
                "(636.714, 763.857]": 127
            }
        },
        {
            "ime_kolone": "Survived",
            "broj_praznih_polja": 0.0,
            "prosek": 0.3838383838383838,
            "standardna_devijacija": 0.4865924542648575,
            "minimum": 0.0,
            "prvi_kvartal": 0.0,
            "drugi_kvartal": 0.0,
            "treci_kvartal": 1.0,
            "maximum": 1.0,
            "broj_autlajera": 0,
            "column_chart_data": {
                "(-0.001, 0.143]": 549,
                "(0.857, 1.0]": 342
            }
        },
        {
            "ime_kolone": "Pclass",
            "broj_praznih_polja": 0.0,
            "prosek": 2.308641975308642,
            "standardna_devijacija": 0.836071240977049,
            "minimum": 1.0,
            "prvi_kvartal": 2.0,
            "drugi_kvartal": 3.0,
            "treci_kvartal": 3.0,
            "maximum": 3.0,
            "broj_autlajera": 0,
            "column_chart_data": {
                "(2.714, 3.0]": 491,
                "(0.998, 1.286]": 216,
                "(1.857, 2.143]": 184
            }
        },
        {
            "ime_kolone": "Age",
            "broj_praznih_polja": 177.0,
            "prosek": 29.69911764705882,
            "standardna_devijacija": 14.526497332334042,
            "minimum": 0.42,
            "prvi_kvartal": 20.125,
            "drugi_kvartal": 28.0,
            "treci_kvartal": 38.0,
            "maximum": 80.0,
            "broj_autlajera": 0,
            "column_chart_data": {
                "(23.157, 34.526]": 233,
                "(11.789, 23.157]": 178,
                "nan": 177,
                "(34.526, 45.894]": 134,
                "(45.894, 57.263]": 68,
                "(0.34, 11.789]": 68,
                "(57.263, 68.631]": 26,
                "(68.631, 80.0]": 7
            }
        },
        {
            "ime_kolone": "SibSp",
            "broj_praznih_polja": 0.0,
            "prosek": 0.5230078563411896,
            "standardna_devijacija": 1.1027434322934317,
            "minimum": 0.0,
            "prvi_kvartal": 0.0,
            "drugi_kvartal": 0.0,
            "treci_kvartal": 1.0,
            "maximum": 8.0,
            "broj_autlajera": 30,
            "column_chart_data": {
                "(-0.008, 1.143]": 817,
                "(1.143, 2.286]": 28,
                "(3.429, 4.571]": 18,
                "(2.286, 3.429]": 16,
                "(6.857, 8.0]": 7,
                "(4.571, 5.714]": 5
            }
        },
        {
            "ime_kolone": "Parch",
            "broj_praznih_polja": 0.0,
            "prosek": 0.38159371492704824,
            "standardna_devijacija": 0.8060572211299483,
            "minimum": 0.0,
            "prvi_kvartal": 0.0,
            "drugi_kvartal": 0.0,
            "treci_kvartal": 0.0,
            "maximum": 6.0,
            "broj_autlajera": 15,
            "column_chart_data": {
                "(-0.006, 0.857]": 678,
                "(0.857, 1.714]": 118,
                "(1.714, 2.571]": 80,
                "(4.286, 5.143]": 5,
                "(2.571, 3.429]": 5,
                "(3.429, 4.286]": 4,
                "(5.143, 6.0]": 1
            }
        },
        {
            "ime_kolone": "Fare",
            "broj_praznih_polja": 0.0,
            "prosek": 32.204207968574636,
            "standardna_devijacija": 49.6934285971809,
            "minimum": 0.0,
            "prvi_kvartal": 7.9104,
            "drugi_kvartal": 14.4542,
            "treci_kvartal": 31.0,
            "maximum": 512.3292,
            "broj_autlajera": 20,
            "column_chart_data": {
                "(-0.512, 73.19]": 789,
                "(73.19, 146.38]": 71,
                "(146.38, 219.57]": 15,
                "(219.57, 292.76]": 13,
                "(439.139, 512.329]": 3
            }
        }
    ],
    "kategoricke_kolone": [
        {
            "ime_kolone": "Name",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 891,
            "najcesca_vrednost": "Braund, Mr. Owen Harris",
            "najveci_broj_ponavljanja": 1,
            "column_chart_data": {
                "Braund, Mr. Owen Harris": 1,
                "Boulos, Mr. Hanna": 1,
                "Frolicher-Stehli, Mr. Maxmillian": 1,
                "Gilinski, Mr. Eliezer": 1,
                "Murdlin, Mr. Joseph": 1,
                "Rintamaki, Mr. Matti": 1,
                "others(885)": 885
            }
        },
        {
            "ime_kolone": "Sex",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 2,
            "najcesca_vrednost": "male",
            "najveci_broj_ponavljanja": 577,
            "column_chart_data": {
                "male": 577,
                "female": 314
            }
        },
        {
            "ime_kolone": "Ticket",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 681,
            "najcesca_vrednost": "347082",
            "najveci_broj_ponavljanja": 7,
            "column_chart_data": {
                "347082": 7,
                "CA. 2343": 7,
                "1601": 7,
                "3101295": 6,
                "CA 2144": 6,
                "347088": 6,
                "others(675)": 852
            }
        },
        {
            "ime_kolone": "Cabin",
            "broj_praznih_polja": 687,
            "broj_jedinstvenih_polja": 147,
            "najcesca_vrednost": "B96 B98",
            "najveci_broj_ponavljanja": 4,
            "column_chart_data": {
                "B96 B98": 4,
                "G6": 4,
                "C23 C25 C27": 4,
                "C22 C26": 3,
                "F33": 3,
                "F2": 3,
                "others(141)": 870
            }
        },
        {
            "ime_kolone": "Embarked",
            "broj_praznih_polja": 2,
            "broj_jedinstvenih_polja": 3,
            "najcesca_vrednost": "S",
            "najveci_broj_ponavljanja": 644,
            "column_chart_data": {
                "S": 644,
                "C": 168,
                "Q": 77
            }
        }
    ]
};*/
  ngOnInit(): void {

    this.statistika=this.shared.getStatistic();
    for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
    {
      this.kolone.push(this.statistika['numericke_kolone'][i]['ime_kolone']);
    }
    for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
    {
      this.kolone.push(this.statistika['kategoricke_kolone'][i]['ime_kolone']);
    }

    this.myChart=new Chart("myChart", {
        type: 'bar',
        data: {
            labels: Object.keys(this.statistika['numericke_kolone'][0]['column_chart_data']) ,
            datasets: [{
                label: '',
                data: Object.values(this.statistika['numericke_kolone'][0]['column_chart_data']),
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
    ;
   
    this.selectChangeHandler();
  }
  
  vrednost: any;

  selectChangeHandler () {
    //update the ui
    


    
    for(let j=0;j<this.kolone.length;j++)
    {

      for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
      {
        if(this.kolone[j]==this.statistika['numericke_kolone'][i]['ime_kolone'])
        {
          this.strStat='';
          this.strStat+='Broj praznih polja: '+this.statistika['numericke_kolone'][i]['broj_praznih_polja']+'<br>Prosek: '
          +this.statistika['numericke_kolone'][i]['prosek']+'<br>Standardna devijacija: ' +this.statistika['numericke_kolone'][i]['standardna_devijacija']+'<br>Minimum: '
          +this.statistika['numericke_kolone'][i]['minimum']+'<br>Prvi kvartal: ' +this.statistika['numericke_kolone'][i]['prvi_kvartal']+'<br>Drugi kvartal: '
          +this.statistika['numericke_kolone'][i]['drugi_kvartal']+'<br>Treci kvartal: ' +this.statistika['numericke_kolone'][i]['treci_kvartal']+'<br>Maximum: '
          +this.statistika['numericke_kolone'][i]['maximum']+'<br>Broj autlajera: ' +this.statistika['numericke_kolone'][i]['broj_autlajera'];
          this.stats.push(this.strStat);
        }

      }
      for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
      {
        if(this.kolone[j]==this.statistika['kategoricke_kolone'][i]['ime_kolone'])
        {
          this.strStat='';
          this.strStat+='Broj praznih polja: '+this.statistika['kategoricke_kolone'][i]['broj_praznih_polja']+'<br>Broj jedinstvenih polja: '
          +this.statistika['kategoricke_kolone'][i]['broj_jedinstvenih_polja']+'<br>Najcesca vrednost: ' +this.statistika['kategoricke_kolone'][i]['najcesca_vrednost']+'<br>Najveci broj ponavljanja: '
          +this.statistika['kategoricke_kolone'][i]['najveci_broj_ponavljanja'];
          this.stats.push(this.strStat);
        }
      }
    }
    console.log(this.myChart);

    
  }
  iscrtajGraf(event:any){
    
    this.vrednost = event.target.value;

    for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
      {
        if(this.vrednost==this.statistika['numericke_kolone'][i]['ime_kolone'])
        {
            this.myChart.destroy();
          //graf
          this.myChart=new Chart("myChart", {
            type: 'bar',
            data: {
                labels: Object.keys(this.statistika['numericke_kolone'][i]['column_chart_data']) ,
                datasets: [{
                    label: '',
                    data: Object.values(this.statistika['numericke_kolone'][i]['column_chart_data']),
                }]
            },
            options: {
                scales: {
                    
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
        ;
        }
      }



    for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
      {
        if(this.vrednost==this.statistika['kategoricke_kolone'][i]['ime_kolone'])
        {
            this.myChart.destroy();
          //graf
          this.myChart=new Chart("myChart", {
            type: 'bar',
            data: {
                labels: Object.keys(this.statistika['kategoricke_kolone'][i]['column_chart_data']) ,
                datasets: [{
                    label: '',
                    data: Object.values(this.statistika['kategoricke_kolone'][i]['column_chart_data']),
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
        ;
        }
      }

  }
  previous()
  {
    this.route.navigate(['./pocetna']);
  }

}
