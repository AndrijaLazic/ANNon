import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Komponente/header/header.component';
import { MojNalogComponent } from '../moduli/moj-nalog/moj-nalog.component';
import { FooterComponent } from './Komponente/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    HeaderComponent,
    MojNalogComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule
  ],
  exports:[
    HeaderComponent,
    MojNalogComponent,
    FooterComponent
  ]
})
export class ZajednickeKomponenteModule { }
