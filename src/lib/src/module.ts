import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import {GridService} from "./am-data-table/grid.service";

import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDatepickerModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdOptionModule,
  MdSelectModule,
  MdSidenavModule,
  MdToolbarModule
} from "@angular/material";

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
} from "./am-data-table/grid";

@NgModule({
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
    imports: [
      CommonModule,
      RouterModule,
      BrowserAnimationsModule,
      FlexLayoutModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      MdCardModule,
      MdButtonModule,
      MdCheckboxModule,
      MdDatepickerModule,
      MdInputModule,
      MdSelectModule,
      MdOptionModule,
      MdDialogModule,
      MdToolbarModule,
      MdIconModule,
      MdSidenavModule,
      MdMenuModule,
      MdListModule
    ],
    entryComponents: [
      GridKeyHeaderFormatter,
      GridPropertyFormatter,
      GridDateFormatter
    ],
    providers: [GridService]
})
export class DataTableModule {
}
