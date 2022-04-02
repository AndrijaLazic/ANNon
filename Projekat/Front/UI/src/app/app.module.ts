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
    IzborParametaraComponent
    
    
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
    DefaultModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
