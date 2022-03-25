import { Component, OnInit } from '@angular/core';
import {SharedService} from "../shared-statistic/shared.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  kolone=new Array();
  stats=new Array();
  strStat:string;
  constructor(private shared: SharedService,private route:Router) { }

  statistika={
    "numericke_kolone": [
        {
            "ime_kolone": "carat",
            "broj_praznih_polja": 0.0,
            "prosek": 0.7979397478679852,
            "standardna_devijacija": 0.47401124440538067,
            "minimum": 0.2,
            "prvi_kvartal": 0.4,
            "drugi_kvartal": 0.7,
            "treci_kvartal": 1.04,
            "maximum": 5.01,
            "broj_autlajera": 439
        },
        {
            "ime_kolone": "depth",
            "broj_praznih_polja": 0.0,
            "prosek": 61.74940489432624,
            "standardna_devijacija": 1.4326213188337733,
            "minimum": 43.0,
            "prvi_kvartal": 61.0,
            "drugi_kvartal": 61.8,
            "treci_kvartal": 62.5,
            "maximum": 79.0,
            "broj_autlajera": 685
        },
        {
            "ime_kolone": "table",
            "broj_praznih_polja": 0.0,
            "prosek": 57.45718390804603,
            "standardna_devijacija": 2.234490562820938,
            "minimum": 43.0,
            "prvi_kvartal": 56.0,
            "drugi_kvartal": 57.0,
            "treci_kvartal": 59.0,
            "maximum": 95.0,
            "broj_autlajera": 336
        },
        {
            "ime_kolone": "price",
            "broj_praznih_polja": 0.0,
            "prosek": 3932.799721913237,
            "standardna_devijacija": 3989.4397381463023,
            "minimum": 326.0,
            "prvi_kvartal": 950.0,
            "drugi_kvartal": 2401.0,
            "treci_kvartal": 5324.25,
            "maximum": 18823.0,
            "broj_autlajera": 1206
        },
        {
            "ime_kolone": "x",
            "broj_praznih_polja": 0.0,
            "prosek": 5.731157211716609,
            "standardna_devijacija": 1.1217607467924422,
            "minimum": 0.0,
            "prvi_kvartal": 4.71,
            "drugi_kvartal": 5.7,
            "treci_kvartal": 6.54,
            "maximum": 10.74,
            "broj_autlajera": 43
        },
        {
            "ime_kolone": "y",
            "broj_praznih_polja": 0.0,
            "prosek": 5.734525954764462,
            "standardna_devijacija": 1.1421346741235396,
            "minimum": 0.0,
            "prvi_kvartal": 4.72,
            "drugi_kvartal": 5.71,
            "treci_kvartal": 6.54,
            "maximum": 58.9,
            "broj_autlajera": 34
        },
        {
            "ime_kolone": "z",
            "broj_praznih_polja": 0.0,
            "prosek": 3.5387337782723316,
            "standardna_devijacija": 0.7056988469499964,
            "minimum": 0.0,
            "prvi_kvartal": 2.91,
            "drugi_kvartal": 3.53,
            "treci_kvartal": 4.04,
            "maximum": 31.8,
            "broj_autlajera": 55
        }
    ],
    "kategoricke_kolone": [
        {
            "ime_kolone": "cut",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 5,
            "najcesca_vrednost": "Ideal",
            "najveci_broj_ponavljanja": 21551
        },
        {
            "ime_kolone": "color",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 7,
            "najcesca_vrednost": "G",
            "najveci_broj_ponavljanja": 11292
        },
        {
            "ime_kolone": "clarity",
            "broj_praznih_polja": 0,
            "broj_jedinstvenih_polja": 8,
            "najcesca_vrednost": "SI1",
            "najveci_broj_ponavljanja": 13065
        }
    ]
}; 
  ngOnInit(): void {
    for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
    {
      this.kolone.push(this.statistika['numericke_kolone'][i]['ime_kolone']);
    }
    for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
    {
      this.kolone.push(this.statistika['kategoricke_kolone'][i]['ime_kolone']);
    }
    console.log(this.kolone);

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
    console.log(this.stats);

    
  }
  previous()
  {
    this.route.navigate(['./pocetna']);
  }

}
