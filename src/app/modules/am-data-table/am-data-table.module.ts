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
import {AM_GRID_DATE_DEFAULT, AM_GRID_DATE_FORMAT} from "./grid.options";

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
  providers: [
    { provide: AM_GRID_DATE_FORMAT, useValue: AM_GRID_DATE_DEFAULT }
  ]
})
export class AmDataTableModule { }
