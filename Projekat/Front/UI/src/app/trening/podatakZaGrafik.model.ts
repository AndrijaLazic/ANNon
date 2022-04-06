export class vrednostiZaGrafikKlasa{
    value:number;
    name:string;
    constructor(value:number,name:string){
      this.value=value;
      this.name=name;
    }
}

export class podatakZaGrafikKlasa{
    name:string;
    series=[];
    constructor(name:string){
      this.name=name;
    }
    dodajSeries(vrednost:vrednostiZaGrafikKlasa){
      this.series.push(vrednost);
    }
  }