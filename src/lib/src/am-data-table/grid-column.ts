import {DataGridFormatter, RowDataFormatter, PropertyFormatter, HeaderFormatter, HeadingFormatter} from "./grid-formatter";
import {TemplateRef, Type} from "@angular/core";
import * as _ from 'lodash';

export interface GridColumnConfig {

  type?: string;
  key: string,
  heading?: string,
  sortable?: boolean,
  noHeading?: boolean,    // if we should display an heading

  headingFormatter?: Type<HeaderFormatter>;
  formatter?: Type<RowDataFormatter>;

  context?: any;
  headingTemplate?: TemplateRef<any>;
  dataTemplate?: TemplateRef<any>;

  options? : any;
}

export interface GridColumnStyle {
  headerCellStyleClasses?: string[];
  filterCellStyleClasses?: string[];
  dataCellStyleClasses?: string[];
  flex?: number;
  minWidth?: string;
  maxWidth?: string;
}

export class GridColumn {
  config: GridColumnConfig;
  styles: GridColumnStyle;
  options: any;

  constructor(config: GridColumnConfig, styles: GridColumnStyle = {}, options: any = {}){
    this.config = {
      key: config.key,
      type: config.type || 'text',
      sortable: !_.isNil(config.sortable) ? config.sortable : false,
      headingFormatter: config.headingFormatter || HeadingFormatter,
      formatter: config.formatter,
      context: config.context || {}
    };

    this.styles = {
      headerCellStyleClasses: !_.isNil(styles.headerCellStyleClasses) ? styles.headerCellStyleClasses : [],
      filterCellStyleClasses: !_.isNil(styles.filterCellStyleClasses) ? styles.filterCellStyleClasses : [],
      dataCellStyleClasses: !_.isNil(styles.dataCellStyleClasses) ? styles.dataCellStyleClasses : [],
      flex: !_.isNil(styles.flex) ? styles.flex : 1,
      minWidth: !_.isNil(styles.minWidth) ? styles.minWidth : null,
      maxWidth: !_.isNil(styles.maxWidth) ? styles.maxWidth : null
    };

    if (!config.heading && !config.noHeading){
      let tempHeading = config.key;
      this.config.heading = '';

      tempHeading.split('.').forEach((name, index)=>{
        this.config.heading += _.startCase(name) + ' ';
      });
    }

    this.options = options;
  }

  show(){
  }

  hide(){
  }
}