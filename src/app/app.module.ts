import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import {DataTablesModule} from 'angular-datatables';

import { routing }        from './app.routing';

import { AlertComponent,DatePicker,SearchChalanModal,SalesPrint } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor,LoaderInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService } from './_services';
import {ApiService}  from './_services/api.service';
import { HomeComponent } from './home';
import { LoginComponent } from './login';

import {RawMaterial} from './_entry/raw_material';
import {FinishedMaterial} from './_entry/finished_material';
import {SalesCompoent} from './_entry/sales'
import {SemiFinishedProduct} from './_entry/semi.finished';
import {FinishedProductIN2} from './_entry/finished_product2'
import {Finish_Product_Entry} from './_entry/finish_product'
import {HeaderComponent} from './header/header.component'
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './loader/loader.component'
import {SpinnerService} from './loader/spinner.service'
import {Reports} from './_entry/report'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {PrintPageComponent,Filters} from './component'
import {RawMaterialReport} from './component/reports';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    BrowserModule,
    NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
  AppComponent,
  AlertComponent,
  HomeComponent,
  LoginComponent,
  
  RawMaterial,
  SemiFinishedProduct,
  FinishedMaterial,
  FinishedProductIN2,
  Finish_Product_Entry,
  
  HeaderComponent,
  SalesCompoent,
  Reports,
  DatePicker,
  LoaderComponent,
  PrintPageComponent,Filters,
  RawMaterialReport,
  SearchChalanModal,
  SalesPrint    ],
providers: [
  AuthGuard,
  AlertService,
  AuthenticationService,
  UserService,
  ApiService,
  SpinnerService,
  { provide: HTTP_INTERCEPTORS, useClass:LoaderInterceptor, multi: true},
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
