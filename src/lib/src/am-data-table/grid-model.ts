import {GridColumn} from "./grid-column";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

import * as _ from 'lodash';

export interface GridModelConfig {
  selection?: boolean
}

export interface GridModelStyles {
  containerClasses?: string[],
  gridClasses?: string[],
  scrollX?: boolean,
  minWidth?: string,
  maxWidth?: string
}

export class GridModel {
  config: GridModelConfig;
  styles: GridModelStyles;
  columns: GridColumn[] = [];
  _changes = new Subject<GridColumn[]>();

  constructor(config: GridModelConfig = {}, styles: GridModelStyles = {}){
    this.config = {
      selection: !_.isNil(config.selection) ? config.selection : false
    };

    this.styles = {
      containerClasses: !_.isNil(styles.containerClasses) ?  styles.containerClasses : [],
      gridClasses: !_.isNil(styles.containerClasses) ? styles.containerClasses : [],
      scrollX: !_.isNil(styles.scrollX) ? styles.scrollX : false,
      minWidth: !_.isNil(styles.minWidth) ? styles.minWidth : null,
      maxWidth: !_.isNil(styles.maxWidth) ? styles.maxWidth : null,
    };
  }

  addColumn(column: GridColumn){
    this.columns.push(column);
    this._changes.next(this.columns);
  }

  /*changes() : Subject<GridColumn[]> {
    return this._changes.debounceTime(10) as Subject<GridColumn[]>;
  }*/

  /*getColumnByKey(key: string){
    return _.find(this.columns, { config: {key: key}});
  }*/

  insertColumn(column: GridColumn, index: number){
    this.notifyChanges();
  }

  removeColumn(column: GridColumn){
    this.columns = _.without(this.columns, column);
    this.notifyChanges();
  }

  removeColumnByIndex(index: number){
    this.columns = this.columns.splice(index, 1);
    this.notifyChanges();
  }

  removeColumnsByKey(key: string){
    _.remove(this.columns, (column)=>{
      return column.config.key == key;
    });
    this.notifyChanges();
  }

  removeAll(){
    this.columns = [];
    this.notifyChanges();
  }

  notifyChanges(){
    this._changes.next(this.columns);
  }
}