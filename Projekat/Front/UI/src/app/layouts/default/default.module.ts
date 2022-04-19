import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/moduli/home/home.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ZajednickeKomponenteModule } from 'src/app/zajednickeKomponente/zajednickeKomponente.module';



@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    ZajednickeKomponenteModule
  ]
})
export class DefaultModule { }
