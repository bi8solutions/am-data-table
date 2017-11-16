import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  GridComponent,
  DataCell,
  DataCellDef,
  DataRow,
  DataRowDef,
  GridDateFormatter,
  GridKeyHeaderFormatter,
  GridPropertyFormatter,
  HeaderCell,
  HeaderCellDef,
  HeaderRow,
  HeaderRowDef,
  HeaderRowOutlet,
  DataRowOutlet,
  RowOutlet,
  ExpanderOutlet,
  CellOutlet
} from "./grid";

import {MatAnchor, MatIconModule, MatPaginatorModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  exports: [
    GridComponent
  ],
  declarations: [
    GridComponent,
    HeaderRowDef,
    HeaderRow,
    HeaderCellDef,
    HeaderCell,

    DataRowDef,
    DataRow,
    DataCellDef,
    DataCell,

    HeaderRowOutlet,
    DataRowOutlet,
    RowOutlet,
    ExpanderOutlet,
    CellOutlet,

    GridKeyHeaderFormatter,
    GridPropertyFormatter,
    GridDateFormatter
  ],
  entryComponents: [
    GridKeyHeaderFormatter,
    GridPropertyFormatter,
    GridDateFormatter
  ],
  providers: []
})
export class AmDataTableModule { }
