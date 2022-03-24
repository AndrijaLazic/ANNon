import { Component, OnInit } from '@angular/core';
import {SharedService} from "../shared-statistic/shared.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  statistika:object;
  kolone:any[];
  htmlStr:string;
  constructor(private shared: SharedService,private route:Router) { }

  ngOnInit(): void {
    this.statistika=this.shared.getStatistic();
    this.kolone=this.shared.getKolone();
  }
  ispis()
  {
    console.log(this.statistika['numericke_kategorije'][0]['ime_kolone']);
    console.log(this.kolone);
  }
  vrednost: any;
  
  selectChangeHandler (event: any) {
    //update the ui
    
    this.vrednost = event.target.value;
    for(let i=0;i<Object.keys(this.statistika['numericke_kolone']).length;i++)
    {
      if(this.vrednost==this.statistika['numericke_kolone'][i]['ime_kolone'])
      {
        this.htmlStr='';
        this.htmlStr+='<b>Broj praznih polja: '+this.statistika['numericke_kolone'][i]['broj_praznih_polja']+'<br>Prosek: '
        +this.statistika['numericke_kolone'][i]['prosek']+'<br>Standardna devijacija: ' +this.statistika['numericke_kolone'][i]['standardna_devijacija']+'<br>Minimum: '
        +this.statistika['numericke_kolone'][i]['minimum']+'<br>Prvi kvartal: ' +this.statistika['numericke_kolone'][i]['prvi_kvartal']+'<br>Drugi kvartal: '
        +this.statistika['numericke_kolone'][i]['drugi_kvartal']+'<br>Treci kvartal: ' +this.statistika['numericke_kolone'][i]['treci_kvartal']+'<br>Maximum: '
        +this.statistika['numericke_kolone'][i]['maximum']+'<br>Broj autlajera: ' +this.statistika['numericke_kolone'][i]['broj_autlajera']+'</b>';
      }

    }
    for(let i=0;i<Object.keys(this.statistika['kategoricke_kolone']).length;i++)
    {
      if(this.vrednost==this.statistika['kategoricke_kolone'][i]['ime_kolone'])
      {
        this.htmlStr='';
        this.htmlStr+='<b>Broj praznih polja: '+this.statistika['kategoricke_kolone'][i]['broj_praznih_polja']+'<br>Broj jedinstvenih polja: '
        +this.statistika['kategoricke_kolone'][i]['broj_jedinstvenih_polja']+'<br>Najcesca vrednost: ' +this.statistika['kategoricke_kolone'][i]['najcesca_vrednost']+'<br>Najveci broj ponavljanja: '
        +this.statistika['kategoricke_kolone'][i]['najveci_broj_ponavljanja']+'</b>';
      }
    }

    
  }
  previous()
  {
    this.route.navigate(['./pocetna']);
  }

}
