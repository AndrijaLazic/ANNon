import { Component, OnInit } from '@angular/core';
import {SharedService} from "../shared-statistic/shared.service";
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  numericki:object;
  kategorijski:object;
  kolone:any[];
  htmlStr:string;
  constructor(private shared: SharedService) { }

  ngOnInit(): void {
    this.numericki=this.shared.getNumericke();
    this.kategorijski=this.shared.getKategorijske();
    this.kolone=this.shared.getKolone();
  }
  /*ispis()
  {
    console.log(this.numericki[0]['ime_kolone']);
    console.log(this.kategorijski);
    console.log(this.kolone);
  }*/
  vrednost: any;
  selectChangeHandler (event: any) {
    //update the ui
    this.vrednost = event.target.value;
    for(let i=0;i<Object.keys(this.numericki).length;i++)
    {
      if(this.vrednost==this.numericki[i]['ime_kolone'])
      {
        this.htmlStr='';
        this.htmlStr+='Ime kolone: '+this.numericki[i]['ime_kolone']+'<br>Broj praznih polja: '+this.numericki[i]['broj_praznih_polja']+'<br>Prosek: '
        +this.numericki[i]['prosek']+'<br>Standardna devijacija: ' +this.numericki[i]['standardna_devijacija']+'<br>Minimum: '
        +this.numericki[i]['minimum']+'<br>Prvi kvartal: ' +this.numericki[i]['prvi_kvartal']+'<br>Drugi kvartal: '
        +this.numericki[i]['drugi_kvartal']+'<br>Treci kvartal: ' +this.numericki[i]['treci_kvartal']+'<br>Maximum: '
        +this.numericki[i]['maximum']+'<br>Broj autlajera: ' +this.numericki[i]['broj_autlajera'];
      }

    }
    for(let i=0;i<Object.keys(this.kategorijski).length;i++)
    {
      if(this.vrednost==this.kategorijski[i]['ime_kolone'])
      {
        this.htmlStr='';
        this.htmlStr+='Ime kolone: '+this.kategorijski[i]['ime_kolone']+'<br>Broj praznih polja: '+this.kategorijski[i]['broj_praznih_polja']+'<br>Broj jedinstvenih polja: '
        +this.kategorijski[i]['broj_jedinstvenih_polja']+'<br>Najcesca vrednost: ' +this.kategorijski[i]['najcesca_vrednost']+'<br>Najveci broj ponavljanja: '
        +this.kategorijski[i]['najveci_broj_ponavljanja'];
      }
    }

    
  }

}
