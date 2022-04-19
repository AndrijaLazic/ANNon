import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Komponente/header/header.component';
import { FooterComponent } from './Komponente/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent
  ]
})
export class ZajednickeKomponenteModule { }
