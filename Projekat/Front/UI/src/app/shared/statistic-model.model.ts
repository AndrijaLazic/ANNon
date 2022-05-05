export class Model
{
  nazivKolone:string="";
  tipPodataka:string="";
  tipEnkodiranja:string="";
  
}

export class statisticModel{
    nizPromena:Array<Model>;
    nizUlaznih:Array<string>;
    izlazna:string;
    nizIzabranihUlaza: Array<any>;
    nizIzabranihIzlaza: Array<any>;
    kategorije: Array<any>;
    tipovi:Array<any>;
}