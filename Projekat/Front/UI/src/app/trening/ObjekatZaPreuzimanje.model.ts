export class ObjekatZaPreuzimanje{
    broj_epohe:number;
    val_loss:number;
    loss:number;
    constructor(brojepohe:number,loss:number,val_los:number){
        this.broj_epohe=brojepohe;
        this.loss=loss;
        this.val_loss=val_los;
    }
}