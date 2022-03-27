import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FullWidth } from 'ag-grid-community/dist/lib/components/framework/componentTypes';
@Component({
  selector: 'app-izbor-parametara',
  templateUrl: './izbor-parametara.component.html',
  styleUrls: ['./izbor-parametara.component.css']
})
export class IzborParametaraComponent implements OnInit {

  constructor() { }
  public SelektovanaVrednost;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
    ngOnInit(){
      this.dropdownList = [
                            {"id":1,"itemName":"India"},
                            {"id":2,"itemName":"Singapore"},
                            {"id":3,"itemName":"Australia"},
                            {"id":4,"itemName":"Canada"},
                            {"id":5,"itemName":"South Korea"},
                            {"id":6,"itemName":"Germany"},
                            {"id":7,"itemName":"France"},
                            {"id":8,"itemName":"Russia"},
                            {"id":9,"itemName":"Italy"},
                            {"id":10,"itemName":"Sweden"}
                          ];
      this.selectedItems = [
                              {"id":2,"itemName":"Singapore"},
                              {"id":3,"itemName":"Australia"},
                              {"id":4,"itemName":"Canada"},
                              {"id":5,"itemName":"South Korea"}
                          ];
      this.dropdownSettings = { 
                                singleSelection: false, 
                                text:"Select Countries",
                                selectAllText:'Select All',
                                unSelectAllText:'UnSelect All',
                                enableSearchFilter: true,
                                classes:"myclass custom-class",
                                badgeShowLimit:"3"
                                
                              };            
  }

  onItemSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
}
OnItemDeSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
}
onSelectAll(items: any){
    console.log(items);
}
onDeSelectAll(items: any){
    console.log(items);
}

}
