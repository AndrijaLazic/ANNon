import { Model } from "../shared/statistic-model.model";

export class ObjekatZaSlanje {
    BrojSlojeva:number;
    TipProblema: string;
    MeraGreske: string;
    MeraUspeha: string;
    ListaSkrivenihSlojeva: ListaSkrivenihSlojeva[];
    UlazneKolone:Array<string>;
    IzlaznaKolona:string;
    odnosPodataka:number;
    NizPromena:Array<Model>;
    BrojEpoha:number;
}

export interface ListaSkrivenihSlojeva {
    BrojNeurona:         number;
    AktivacionaFunkcija: string;
}