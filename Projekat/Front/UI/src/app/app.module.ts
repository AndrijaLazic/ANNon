import {NgxPaginationModule} from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExcelsheetComponent } from './excelsheet/excelsheet.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { LoginParentComponent } from './login-parent/login-parent.component';
import { LoginComponent } from './login-parent/login/login.component';
import { RegisterParentComponent } from './register-parent/register-parent.component';
import { RegisterComponent } from './register-parent/register/register.component';
import { PocetnastranaComponent } from './pocetnastrana/pocetnastrana.component';
import { HttpClientModule } from '@angular/common/http';
import { PaginationComponent } from './excelsheet/pagination/pagination.component';
import { MatSelectModule } from '@angular/material/select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { VerifikacijaComponent } from './proba/verifikacija/verifikacija.component';
import { HeaderComponent } from './not-login/header/header.component';
import { FooterComponent } from './not-login/footer/footer.component';
import { StatisticComponent } from './statistic/statistic.component';
import { CsvTabelaComponent } from './csv-tabela/csv-tabela.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgxSpinnerModule } from "ngx-spinner";
import { TreningComponent } from './trening/trening.component';
import { IzborParametaraComponent } from './izbor-parametara/izbor-parametara.component';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { ChartModel } from 'ag-grid-community';
import { NgChartsModule } from 'ng2-charts';
import { DefaultModule } from './layouts/default/default.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PocetnatestComponent } from './pocetnatest/pocetnatest.component';
import { ClickOutsideDirective } from './zajednickeKomponente/Komponente/clickOutside.directive';
import { TeamComponent } from './team/team.component';
import { FilePickerModule } from  'ngx-awesome-uploader';
import { FilePickerAdapter } from 'ngx-awesome-uploader';

import { MojNalogComponent } from './moj-nalog/moj-nalog.component';
import { PoredjenjeModelaComponent } from './poredjenje-modela/poredjenje-modela.component';

import {MatTooltipModule} from '@angular/material/tooltip';
import { SacuvaniModeliComponent } from './sacuvani-modeli/sacuvani-modeli.component';
import { MycellRenderComponent } from './sacuvani-modeli/mycell-render/mycell-render.component';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

// Ahead of time compiles requires an exported function for factories

/*
const dbConfig: DBConfig  = {
  name: 'IgrannonicaDB',
  version: 3,
  objectStoresMeta: [{
    store: 'files',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'fileName', keypath: 'name', options: { unique: false } },
      { name: 'file', keypath: 'file', options: { unique: false } }
    ]
  }],

};
*/

@NgModule({
  declarations: [
    AppComponent,
    ExcelsheetComponent,
    LoginParentComponent,
    LoginComponent,
    RegisterParentComponent,
    RegisterComponent,
    PocetnastranaComponent,
    PaginationComponent,
    VerifikacijaComponent,
    StatisticComponent,
    CsvTabelaComponent,
    TreningComponent,
    IzborParametaraComponent,
    PocetnatestComponent,
    ClickOutsideDirective,
    TeamComponent,
    MojNalogComponent,
    PoredjenjeModelaComponent,
    SacuvaniModeliComponent,
    MycellRenderComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MdbCollapseModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AgGridModule.withComponents([CsvTabelaComponent]),
    NgxSpinnerModule,
    MatSelectModule,
    AngularMultiSelectModule,
    NgxNumberSpinnerModule,
    NgChartsModule,
    MatButtonModule,
    DefaultModule,
    NgxChartsModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    FilePickerModule,
    MatTooltipModule,
    //NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
