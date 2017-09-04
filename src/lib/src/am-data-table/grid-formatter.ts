import {GridColumn} from "./grid-column";
import {Component, Input, Type} from "@angular/core";

export class DataGridFormatter {
  constructor(public component: Type<RowDataFormatter>, public row: any){
  }
}

export interface RowDataFormatter {
  column: GridColumn;
  row: any;
}

@Component({
  template: `{{getValue()}}`
})
export class PropertyFormatter implements RowDataFormatter {
  @Input() column: GridColumn;
  @Input() row: any;

  getValue(){
    try {
      return eval(`this.row.${this.column.config.key}`);
    } catch (error){
      return null;
    }
  }
}

@Component({
  template: `{{getValue() | date : getFormat()}}`
})
export class DatePropertyFormatter extends PropertyFormatter {
  @Input() column: GridColumn;
  @Input() row: any;

  getFormat(){
    return this.column.options.dateFormat || 'fullDate';
  }
}

export interface HeaderFormatter {
  column: GridColumn;
}

@Component({
  template: `{{column.config.heading}}`
})
export class HeadingFormatter implements HeaderFormatter {
  @Input() column: GridColumn;
}

