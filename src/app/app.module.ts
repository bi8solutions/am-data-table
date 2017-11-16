import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatCardModule, MatIconModule, MatPaginatorModule} from "@angular/material";
import { AmDataTableModule } from "./modules/am-data-table/am-data-table.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    AmDataTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
