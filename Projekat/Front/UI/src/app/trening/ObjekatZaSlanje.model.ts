export class ObjekatZaSlanje {
    BrojSlojeva:number;
    TipProblema: string;
    MeraGreske: string;
    MeraUspeha: string;
    ListaSkrivenihSlojeva: ListaSkrivenihSlojeva[];
    UlazneKolone:[];
    IzlaznaKolona:string;
    odnosPodataka:number;
    
}

export interface ListaSkrivenihSlojeva {
    BrojNeurona:         number;
    AktivacionaFunkcija: string;
}