import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

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

import {GridComponent} from "./am-data-table/grid.component";

import {GridHeaderCellDirective} from "./am-data-table/grid-header-cell.directive";
import {GridDataCellDirective} from "./am-data-table/grid-data-cell.directive";

import {DatePropertyFormatter, HeadingFormatter, PropertyFormatter} from "./am-data-table/grid-formatter";
import {GridHeaderRowComponent} from "./am-data-table/grid-header-row.component";

import {GridDataRowComponent} from "./am-data-table/grid-data-row.component";
import {GridService} from "./am-data-table/grid.service";

@NgModule({
    exports: [
      PropertyFormatter,
      DatePropertyFormatter,
      HeadingFormatter,
      GridComponent
    ],
    declarations: [
      GridHeaderCellDirective,
      GridDataCellDirective,
      GridComponent,
      PropertyFormatter,
      DatePropertyFormatter,
      HeadingFormatter,
      GridHeaderRowComponent,
      GridDataRowComponent
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
    entryComponents: [PropertyFormatter, DatePropertyFormatter, HeadingFormatter],
    providers: [GridService]
})
export class DataTableModule {
}
