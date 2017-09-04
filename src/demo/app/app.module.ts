import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ActionFormatter, AppComponent, SadHeadingFormatter} from './app.component';

import {LogConfig, LogLevel} from '@bi8/am-logger';
import {MdCardModule, MdPaginatorModule, MdTableModule, MdToolbarModule} from "@angular/material";

import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CdkTableModule} from "@angular/cdk/table";
import {DataTableModule} from "@bi8/am-data-table";

const logConfig : LogConfig = { level: LogLevel.debug };

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdCardModule,
    MdToolbarModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    DataTableModule,
    MdTableModule,
    CdkTableModule,
    FlexLayoutModule,
    MdPaginatorModule
  ],
  entryComponents: [SadHeadingFormatter, ActionFormatter],
  declarations: [ AppComponent, SadHeadingFormatter, ActionFormatter ],
  bootstrap:    [ AppComponent ],
  providers:    [
      { provide: 'LogConfig', useValue: logConfig }
  ]
})
export class AppModule { }
