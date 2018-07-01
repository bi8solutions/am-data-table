import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Directive,
  ElementRef, EventEmitter, forwardRef, Inject, Injectable, InjectionToken,
  Input,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  OnInit, Optional, Output,
  QueryList,
  Renderer2,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";

import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import * as _ from 'lodash';
import {takeUntil} from "rxjs/operator/takeUntil";
import {Observable} from "../../../../node_modules/rxjs";

export interface GridDateFormat {
    format: string;
}

export const AM_GRID_DATE_FORMAT =
  new InjectionToken<GridDateFormat>('am.grid.date.format');

export const AM_GRID_DATE_DEFAULT: GridDateFormat = {
  format: 'fullDate'
};


//=====[ UTILS ]======================================================================================================================================

function toCssFriendly(value: string) : string {
  // the string value is typically generated from the column key that may contain '.'
  return value ? value.split('.').map(item => _.kebabCase(item)).join('-') : value;
}

//=====[ OUTLETS ]====================================================================================================================================

@Directive({selector: '[headerRowOutlet]'})
export class HeaderRowOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[dataRowOutlet]'})
export class DataRowOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[rowOutlet]'})
export class RowOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[expanderOutlet]'})
export class ExpanderOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[cellOutlet]'})
export class CellOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

//=====[ HEADER ROW ]=================================================================================================================================

@Directive({
  selector: '[headerRowDef]',
  inputs: ['model: headerRowDef']
})
export class HeaderRowDef {
  model: GridModel;

  constructor(public templateRef: TemplateRef<any>, public viewContainer: ViewContainerRef){
  }
}

@Directive({
  selector: '[headerCellDef]',
  inputs: ['column: column']
})
export class HeaderCellDef {
  column: GridColumn;
  constructor(public templateRef: TemplateRef<any>,
              public viewContainer: ViewContainerRef){
  }
}

@Component({
  selector: 'header-cell',
  inputs: ['column: column'],
  template: `
    <ng-container cellOutlet></ng-container>
  `,
  host: {
    'class': 'am-header-cell',
    'role': 'row',
  },
  encapsulation: ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderCell implements OnInit, OnDestroy, AfterContentInit,  OnChanges {

  column: GridColumn;
  @ViewChild(CellOutlet) _cellOutlet: CellOutlet;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver,
              protected elementRef: ElementRef,
              protected renderer: Renderer2){
  }

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, `am-header-cell-${toCssFriendly(this.column.config.key)}`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'flex', this.column.styles.flex || 1);

    if (this.column.styles.minWidth){
      this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', this.column.styles.minWidth);

    } else if (this.column.model.styles.minColumnWidth){
      this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', this.column.model.styles.minColumnWidth);
    }

    if (this.column.styles.headerCellStyleClasses){
      this.column.styles.headerCellStyleClasses.forEach((cls, index)=>{
        this.renderer.addClass(this.elementRef.nativeElement, cls);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterContentInit(): void {
    this.renderCell();
  }

  renderCell(){
    this._cellOutlet.viewContainer.clear();

    if (this.column.config.headingTemplate){
      this._cellOutlet.viewContainer.createEmbeddedView(this.column.config.headingTemplate, {column: this.column});

    } else {
      let formatter: Type<GridHeaderFormatter> = this.column.config.headingFormatter;
      if (formatter){
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(formatter);

        let viewContainerRef = this._cellOutlet.viewContainer;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<GridHeaderFormatter>componentRef.instance).column = this.column;

      } else {
        console.warn(`Could not find header formatter for column with key '${this.column.config.key}'.`);
      }
    }
  }
}


@Component({
  selector: 'header-row',
  inputs: ['model: model'],
  template: `
    <div *ngIf="model.config.showExpander" class="am-header-expander-column"></div>
    <ng-container rowOutlet></ng-container>
    <ng-container>
      <header-cell *headerCellDef="let column;" [column]="column"></header-cell>
      <!--<header-cell *headerCellDef="let column as column;" [column]="column"></header-cell>-->
    </ng-container>
  `,
  host: {
    'class': 'am-header-row',
    'role': 'row',
  },
  encapsulation: ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderRow implements AfterContentInit {

  @Output('events') events$ = new EventEmitter<GridEvent>();

  @ViewChild(RowOutlet) _rowOutlet: RowOutlet;
  @ViewChild(HeaderCellDef) _headerCellDef: HeaderCellDef;
  @ViewChildren(HeaderCell) headerCells : QueryList<HeaderCell>;

  model: GridModel;

  constructor(protected _changeDetectorRef: ChangeDetectorRef){
  }

  ngAfterContentInit(): void {
    // first we clear the row container
    this._rowOutlet.viewContainer.clear();

    // then render each column
    this.model.columns.forEach((column, index)=>{
      this.renderHeaderCell(column);
    });
  }

  renderHeaderCell(column: GridColumn, index?: number){
    this._rowOutlet.viewContainer.createEmbeddedView(this._headerCellDef.templateRef, {$implicit: column}, index);
  }

  clearCells(){
    this._rowOutlet.viewContainer.clear();
  }

  /**
   * Iterate the changes and apply add/remove/insert operations to the collection of header cells (columns)
   * @todo - can still do the TODO one for moving a column (look at material2 data table sort for an example
   *
   */
  applyColumnChanges(changes: IterableChanges<GridColumn>){
    if (!changes){
      return;
    }

    // remove
    changes.forEachRemovedItem((record: IterableChangeRecord<GridColumn>)=>{
      //console.log("removing existing cell", record);
      this._rowOutlet.viewContainer.remove(record.previousIndex);

      this.events$.emit({
        type: GridEventType.ColumnRemoved,
        data: record
      });
    });

    // add, insert
    changes.forEachAddedItem((record: IterableChangeRecord<GridColumn>)=>{
       //console.log("adding/inserting new cell for new column", record);
       this.renderHeaderCell(record.item, record.currentIndex);

      this.events$.emit({
        type: GridEventType.ColumnAdded,
        data: record
      });
    });

    // then tell Angular to do it's checks
    this._changeDetectorRef.markForCheck();
  }
}

//=====[ DATA ROW ]===================================================================================================================================

export interface RowContext {
  // the row data
  data: any;

  // the grid model with columns
  model: GridModel;

  // Index location of the row.
  index?: number;

  // Total row count
  count?: number;

  // True if this is the first row
  first?: boolean;

  // True if this is the last row
  last?: boolean;

  // True if row has an even-numbered index.
  even?: boolean;

  // True if row has an odd-numbered index.
  odd?: boolean;

  // if the detail expander is shown or not
  expanded?: boolean;
}

@Directive({selector: '[dataRowDef]',})
export class DataRowDef {
  constructor(public templateRef: TemplateRef<any>,
              public viewContainer: ViewContainerRef){
  }
}

@Directive({selector: '[dataCellDef]',})
export class DataCellDef {
  constructor(public templateRef: TemplateRef<any>,
              public viewContainer: ViewContainerRef){
  }
}

@Component({
  selector: 'data-cell',
  inputs: ['column: column', 'row: row'],
  template: `
    <ng-container cellOutlet></ng-container>
  `,
  host: {
    'class': 'am-data-cell',
    'role': 'row',
  },
  encapsulation: ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataCell implements OnInit, AfterContentInit {

  column: GridColumn;
  row: RowContext;
  @ViewChild(CellOutlet) _cellOutlet: CellOutlet;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver,
              protected elementRef: ElementRef,
              protected renderer: Renderer2){
  }

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, `am-data-cell-${toCssFriendly(this.column.config.key)}`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'flex', this.column.styles.flex || 1);

    if (this.column.styles.minWidth){
      this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', this.column.styles.minWidth);

    } else if (this.column.model.styles.minColumnWidth){
      this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', this.column.model.styles.minColumnWidth);
    }

    if (this.column.styles.dataCellStyleClasses){
      this.column.styles.dataCellStyleClasses.forEach((cls, index)=>{
        this.renderer.addClass(this.elementRef.nativeElement, cls);
      });
    }
  }

  ngAfterContentInit(): void {
    this.renderCell();
  }

  renderCell(){
    /////////////console.log('DataCell: row:', this.row);
    /////////////console.log('DataCell: column:', this.column);
    //console.log(`rendering: ${this.column.config.key}`);

    this._cellOutlet.viewContainer.clear();

    if (this.column.config.dataTemplate){
      this._cellOutlet.viewContainer.createEmbeddedView(this.column.config.dataTemplate, {column: this.column, row: this.row});

    } else {
      let formatter: Type<GridDataFormatter> = this.column.config.formatter;
      if (formatter){
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(formatter);

        let viewContainerRef = this._cellOutlet.viewContainer;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<GridDataFormatter>componentRef.instance).column = this.column;
        (<GridDataFormatter>componentRef.instance).row = this.row;

      } else {
        console.warn(`Could not find data formatter for column with key '${this.column.config.key}'.`);
      }
    }
  }
}

const EXPANDER_ICON_CLOSED = 'keyboard_arrow_right';
const EXPANDER_ICON_OPEN = 'keyboard_arrow_down';

export interface DataRowStyleResolver {
  (row: RowContext): string[];
}

export interface DataCellStyleResolver {
  (row: RowContext, column: GridColumn): string[];
}

@Component({
  selector: 'data-row',
  inputs: ['row: row'],
  template: `
    <!-- 
         
    Expander Status - show/hide/disable (also with a tooltip)
    Expander Type - Chevron (expand/contract), Slider (slide-in/slide-out)   
    
    rowDataFormatter {
      span: [
        ['firstName','lastName']        
      ]
      
      colSpan: ['firstName','lastName']
    }
    
    GridColumn
    StackedGridColumn
    
     
    
    emit({
      type: RowExpanded / RowContracted,
      data: record
    })
    
    emit({
      type: RowAdded, RowRemoved
      data: record
    })
            
    
    I would also like the ability 
 
    [ wildcard search ] - across all columns        
    ---------------------------------------------------------------------   
    |    | First Name            |  Mobile      |  Birth Date           |
    |    | Surname               |  Email       |  Age                  |
    ---------------------------------------------------------------------
    ===================================================================== 
    [F]: | [ First Name        ] | [ Mobile   ] | [DATE-FORM] [DATE-TO] |
           [ Last Name         ] | [ Email    ] |                       |
    =====================================================================
         | Manie                 |  Coetzee      |  77/05/05            |
      >  | Coetzee               |  mc@bla.com   |  40                  |
    ---------------------------------------------------------------------
         |           |                             13 Pioneer Road      |
         | [ADDRESS] |                             Durbanville          |
         |           |                             7550                 |
    ---------------------------------------------------------------------
    EXPANDER
    =====================================================================
    \                                                                   \
    \                                                                   \
    \                                                                   \
    \                                                                   \
    =====================================================================
    -->    
    
    <div style="flex: 1 1 auto;" [ngClass]="rowClass()">
      <div style="display: flex; flex: 1 1 auto;" [ngClass]="{'am-expanded-row': row.expanded && !rowClass()}">
        <div *ngIf="row.model.config.showExpander" class="am-header-expander-column">
          <mat-icon (click)="toggleExpander()">{{expanderIcon}}</mat-icon>
        </div>
        <ng-container rowOutlet></ng-container>
      </div>
      <div style="flex: 1 1 auto;" [ngClass]="{'am-expander-row': row.expanded}">
        <ng-container expanderOutlet></ng-container>
      </div>
    </div>
    <ng-container>
      <data-cell *dataCellDef="let column; " [column]="column" [row]="row" [ngClass]="cellClass(column)"></data-cell>
    </ng-container>
  `,
  host: {
    'class': 'am-data-row',
    'role': 'row',
  },
  encapsulation: ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataRow implements AfterContentInit {

  @Output('events') events$ = new EventEmitter<GridEvent>();

  @ViewChild(RowOutlet) _rowOutlet: RowOutlet;
  @ViewChild(DataCellDef) _dataCellDef: DataCellDef;
  @ViewChildren(DataCell) dataCells : QueryList<DataCell>;
  @ViewChild(ExpanderOutlet) _expanderOutlet: ExpanderOutlet;

  row: RowContext;

  expanderIcon: string = EXPANDER_ICON_CLOSED;

  constructor(protected _changeDetectorRef: ChangeDetectorRef){
  }

  rowClass(){
    if (this.row.model.styles.dataRowStyleResolver){
      return this.row.model.styles.dataRowStyleResolver(this.row);
    } else {
      return null;
    }
  }

  cellClass(column: GridColumn){
    if (column.styles.dataCellStyleResolver){
      return column.styles.dataCellStyleResolver(this.row, column);
    } else {
      return null;
    }
  }

  ngAfterContentInit(): void {
    /////////////console.log("DataRow: model:", this.row.model);
    /////////////console.log("DataRow: row:", this.row.data);

    // first we clear the row container
    this._rowOutlet.viewContainer.clear();

    // then render each column
    this.row.model.columns.forEach((column, index)=>{
      this.renderDataCell(column);
    });
  }

  renderDataCell(column: GridColumn, index?: number){
    this._rowOutlet.viewContainer.createEmbeddedView(this._dataCellDef.templateRef, {$implicit: column, row: this.row}, index);
  }

  /**
   * Iterate the changes and apply add/remove/insert operations to the collection of header cells (columns)
   * @todo - can still do the TODO one for moving a column (look at material2 data table sort for an example
   *
   */
  applyColumnChanges(changes: IterableChanges<GridColumn>){
    if (!changes){
      return;
    }

    // add, insert
    changes.forEachAddedItem((record: IterableChangeRecord<GridColumn>)=>{
      /////////////console.log("adding/inserting new cell for new column", record);
       this.renderDataCell(record.item, record.currentIndex);
    });

    // remove
    changes.forEachRemovedItem((record: IterableChangeRecord<GridColumn>)=>{
      /////////////console.log("removing existing cell", record);
      this._rowOutlet.viewContainer.remove(record.previousIndex);
    });

    // then tell Angular to do it's checks
    this._changeDetectorRef.markForCheck();
  }

  toggleExpander(){
    this._expanderOutlet.viewContainer.clear();


    if (this.row.expanded){
      this.row.expanded = false;
      this.expanderIcon = EXPANDER_ICON_CLOSED;

    } else {
      this.row.expanded = true;
      this.expanderIcon = EXPANDER_ICON_OPEN;

      if (this.row.model.config.expanderTemplate){
        this._expanderOutlet.viewContainer.createEmbeddedView(this.row.model.config.expanderTemplate, {row: this.row});
      }
    }

    this.events$.emit({
      type: this.row.expanded ? GridEventType.RowExpanded : GridEventType.RowContracted,
      data: this.row
    });
  }
}

//=====[ GRID COMPONENT ]=============================================================================================================================

@Component({
  selector: 'am-data-grid',
  template: `
    <div class="am-grid">
      <ng-container headerRowOutlet></ng-container>
      <ng-container dataRowOutlet></ng-container>
      <ng-container>
        <header-row *headerRowDef="let model" [model]="model" (events)="emit($event)"></header-row>
        <data-row *dataRowDef="let row" [row]="row" (events)="emit($event)"></data-row>    
      </ng-container>  
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent<T> implements OnInit, AfterViewInit, OnDestroy, AfterContentInit, AfterContentChecked, OnChanges, CollectionViewer  {
  @Output('events') events$ = new EventEmitter<GridEvent>();
  data: any[] = [];
  @Input() model: GridModel;

  private _dataSource: DataSource<T>;
  private onDestroy = new Subject<void>();
  private dataSubscription: Subscription | null;

  @Input()
  get dataSource(): DataSource<T> {
    return this._dataSource;
  }

  set dataSource(dataSource: DataSource<T>) {
    if (this._dataSource !== dataSource) {
      this.switchDataSource(dataSource);
    }
  }

  @ViewChild(HeaderRowOutlet) _headerRowOutlet: HeaderRowOutlet;
  @ViewChild(HeaderRowDef) _headerRowDef: HeaderRowDef;

  @ViewChild('headerRow') headerRowTemplate: TemplateRef<any>;
  @ViewChild(HeaderRow) headerRow : HeaderRow;   // wil only be visible on the next changes (after everything has rendered)

  @ViewChild(DataRowOutlet) _dataRowOutlet: DataRowOutlet;
  @ViewChild(DataRowDef) _dataRowDef: DataRowDef;
  @ViewChildren(DataRow) dataRows : QueryList<DataRow>;   // wil only be visible on the next changes (after everything has rendered)

  // keep track of the changes on the model's columns
  private columnsDiffer: IterableDiffer<GridColumn>;

  // keep track of the changes on datasource
  private dataDiffer: IterableDiffer<T>;

  modelSubscription: Subscription;

  viewChange = new BehaviorSubject<{start: number, end: number}>({start: 0, end: Number.MAX_VALUE});

  gridDefaults: GridDefaults = new GridDefaults();

  constructor(protected _differs: IterableDiffers,
              protected _changeDetectorRef: ChangeDetectorRef){

  }

  toggleRowExpander(index: number){
    try {
      this.dataRows.toArray()[index].toggleExpander();
    } catch (error){
      console.log(error);
    }
  }

  emit(event){
    //console.log(`Grid Event ${GridEventType[event.type]}:`, event);
    this.events$.emit(event);
  }

  ngOnInit(): void {
    // create the columns differ to track changes to the column array
    this.columnsDiffer = this._differs.find(this.model.columns).create();

    this.dataDiffer = this._differs.find([]).create();

    this.model.grid = this;

  }

  ngAfterContentInit(): void {
    // make sure that all the column override/default templates/formatters are applied
    this.gridDefaults.applyDefaults(this.model.columns);

    // do the initial diff so that the next one will show any changes when doing the next diff
    this.columnsDiffer.diff(this.model.columns);

    // ok, lets setup/render the header row
    this.setupHeader();

    this.observeModel();
    this.observeDataSource();
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
    //this.toggleRowExpander(this.model.config.expandRowIndex);
    //console.log("GridComponent: ngAfterViewInit");
    //this.model.grid = this;

    this.emit({
      type: GridEventType.Initialized,
      data: this.model
    });
  }

  ngAfterViewChecked() {
    //this.toggleRowExpander(this.model.config.expandRowIndex);
    this._changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("GridComponent: ngOnChanges", this.model);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();

    if (this.dataSource) {
      this.dataSource.disconnect(this);
    }

    // clean up the subscription to the grid model when we are destroyed
    if (this.modelSubscription){
      this.modelSubscription.unsubscribe();
      this.modelSubscription = null;
    }
  }

  setupHeader(){
    // lets clear the row outlet container to make sure everything is squeeky clean
    this._headerRowOutlet.viewContainer.clear();

    // render the template that contains the header row component
    this._headerRowOutlet.viewContainer.createEmbeddedView(this._headerRowDef.templateRef, {$implicit: this.model});
  }

  gridModelChanged(event?: GridModelEvent){

    // always apply defaults (default data and header formatter if none specified)
    this.gridDefaults.applyDefaults(this.model.columns);

    // first we do the diff to get the changes (if any)
    let changes = this.columnsDiffer.diff(this.model.columns);

    //@todo - need a way to update columns - could basically just add
    /*if (event && event.type == GridModelEventType.UPDATE){
      // if this is an update
      this.columnsDiffer.diff([]);
      changes = this.columnsDiffer.diff(this.model.columns);
      this.headerRow.clearCells();
    }*/

    // tell header row to look at the changes to insert/update/remove where required
    this.headerRow.applyColumnChanges(changes);

    this.dataRows.forEach((dataRow, index)=>{
      dataRow.applyColumnChanges(changes);
    });

    // make sure that our component is checked for any other changes
    this._changeDetectorRef.markForCheck();
  }

  dataSourceDataChanged(){
    const changes = this.dataDiffer.diff(this.data);
    if (!changes) {
      return;
    }

    // remove
    changes.forEachRemovedItem((record: IterableChangeRecord<T>)=>{
      //console.log("removing existing row", record);
      this._dataRowOutlet.viewContainer.remove(record.previousIndex);

      this.emit({
        type: GridEventType.RowRemoved,
        data: record
      });
    });

    // add, insert
    changes.forEachAddedItem((record: IterableChangeRecord<T>)=>{
      //console.log("adding/inserting new row", record);
      let rowContext: RowContext = {
        data: record.item,
        model: this.model,
        expanded: false
      };

      this._dataRowOutlet.viewContainer.createEmbeddedView(this._dataRowDef.templateRef, {$implicit: rowContext}, record.currentIndex);

      this.emit({
        type: GridEventType.RowAdded,
        data: record
      });
    });

    //@Todo - not the right place - just a temporary work around
    this.emit({
      type: GridEventType.Reloaded,
      data: this.data
    });

    // we need to wait one tick for the rows to be rendered before trying to toggle them
    setTimeout(()=>{
      // we just want to do this once.  We can always call the toggleExpander manually but you would have to do it after the data has been loaded
      if (this.model.config.expandRowIndex > -1){
        this.toggleRowExpander(this.model.config.expandRowIndex);
        this.model.config.expandRowIndex = -1;
      }
    }, 0);

    // then tell Angular to do it's checks
    this._changeDetectorRef.markForCheck();
  }

  private switchDataSource(dataSource: DataSource<T>) {
    this.data = [];

    if (this._dataSource) {
      this._dataSource.disconnect(this);
    }

    // Stop listening for data from the previous data source.
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = null;
    }

    this._dataSource = dataSource;
  }

  private observeModel(){
    this.modelSubscription = this.model._changes.subscribe((event: GridModelEvent)=>{
      this.gridModelChanged(event);
    });
  }

  private observeDataSource(){
    if (this.dataSource && !this.dataSubscription) {
      this.dataSubscription = takeUntil.call(this.dataSource.connect(this), this.onDestroy).subscribe(data => {
        this.data = data;
        this.dataSourceDataChanged();
      });
    }
  }
}

export enum GridEventType {
  RowExpanded,
  RowContracted,
  RowRemoved,
  RowAdded,
  Reloaded,
  ColumnRemoved,
  ColumnAdded,
  DataChange,
  Initialized
}

export interface GridEvent {
  type: GridEventType,
  data?: any
}

//=====[ GRID MODEL ]=================================================================================================================================

export interface GridModelConfig {
  selection?: boolean,
  showExpander?: boolean,
  expanderFormatter?: Type<GridExpanderFormatter>;
  expanderTemplate?: TemplateRef<any>;
  expandRowIndex?: number;
}

export interface GridModelStyles {
  containerClasses?: string[],
  gridClasses?: string[],
  scrollX?: boolean,
  minColumnWidth?: string,
  dataRowStyleResolver?: DataRowStyleResolver
}

export enum GridModelEventType {
  ADD,
  REMOVE,
  UPDATE
}

export interface GridModelEvent {
  type: GridModelEventType,
  column?: GridColumn,
  columns: GridColumn[]
}

export class GridModel {
  config: GridModelConfig;
  styles: GridModelStyles;
  columns: GridColumn[] = [];
    _changes = new Subject<GridModelEvent>();
  grid: GridComponent<any>;

  constructor(config: GridModelConfig, styles: GridModelStyles = {}){
    this.config = {
      selection: !_.isNil(config.selection) ? config.selection : false,
      showExpander: !_.isNil(config.showExpander) ? config.showExpander : false,
      expanderFormatter: !_.isNil(config.expanderFormatter) ? config.expanderFormatter : null,
      expanderTemplate: !_.isNil(config.expanderTemplate) ? config.expanderTemplate : null,
      expandRowIndex: config.expandRowIndex
    };

    this.styles = {
      containerClasses: !_.isNil(styles.containerClasses) ?  styles.containerClasses : [],
      gridClasses: !_.isNil(styles.containerClasses) ? styles.containerClasses : [],
      scrollX: !_.isNil(styles.scrollX) ? styles.scrollX : false,
      minColumnWidth: !_.isNil(styles.minColumnWidth) ? styles.minColumnWidth : null,
      dataRowStyleResolver: styles.dataRowStyleResolver || null
    };
  }

  toggleExpander(index: number){
    this.grid.toggleRowExpander(index);
  }

  addColumn(column: GridColumn){
    column.model = this;
    this.columns.push(column);
    this.notifyChanges(GridModelEventType.ADD);
  }

  getColumnByKey(key: string) : GridColumn {
    return _.find(this.columns, { config: {key: key}});
  }

  insertColumn(column: GridColumn, index: number){
    //column.model = this;
    this.columns.splice(index, 0, column);
    this.notifyChanges(GridModelEventType.ADD);
  }

  removeColumn(column: GridColumn){
    this.columns = _.without(this.columns, column);
    this.notifyChanges(GridModelEventType.REMOVE);
  }

  removeColumnByIndex(index: number){
    this.columns.splice(index, 1);
    this.notifyChanges(GridModelEventType.REMOVE);
  }

  removeColumnsByKey(key: string){
    _.remove(this.columns, (column)=>{
      return column.config.key == key;
    });
    this.notifyChanges(GridModelEventType.REMOVE);
  }

  updateStyles(){
    this.notifyChanges(GridModelEventType.UPDATE, null);
  }

  updateColumn(column: GridColumn){
    let index = this.columns.indexOf(column);
    if (index > -1){
      this.columns[index] = column;
    }
    this.notifyChanges(GridModelEventType.UPDATE, column);
  }
  removeAll(){
    this.columns = [];
    this.notifyChanges(GridModelEventType.REMOVE);
  }

  notifyChanges(type: GridModelEventType, column?: GridColumn){
    this._changes.next({
      type: type,
      column: column,
      columns: this.columns
    });
  }
}

export interface GridColumnConfig {
  key: string,
  type?: string;
  heading?: string,
  sortable?: boolean,
  noHeading?: boolean,    // if we should display an heading

  headingFormatter?: Type<GridHeaderFormatter>;
  formatter?: Type<GridDataFormatter>;

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
  dataCellStyleResolver?: DataCellStyleResolver
}

export class GridColumn {
  model: GridModel;
  config: GridColumnConfig;
  styles: GridColumnStyle;
  options: any;
  refresh: boolean = false;

  constructor(config: GridColumnConfig, styles: GridColumnStyle = {}, options: any = {}){
    this.config = {
      key: config.key,
      type: config.type || 'text',
      heading: config.heading,
      sortable: !_.isNil(config.sortable) ? config.sortable : false,
      noHeading: config.noHeading,
      headingFormatter: config.headingFormatter || GridKeyHeaderFormatter,
      formatter: config.formatter,
      context: config.context || {},
      headingTemplate: config.headingTemplate,
      dataTemplate: config.dataTemplate
    };

    this.styles = {
      headerCellStyleClasses: !_.isNil(styles.headerCellStyleClasses) ? styles.headerCellStyleClasses : [],
      filterCellStyleClasses: !_.isNil(styles.filterCellStyleClasses) ? styles.filterCellStyleClasses : [],
      dataCellStyleClasses: !_.isNil(styles.dataCellStyleClasses) ? styles.dataCellStyleClasses : [],
      flex: !_.isNil(styles.flex) ? styles.flex : 1,
      minWidth: !_.isNil(styles.minWidth) ? styles.minWidth : null,
      maxWidth: !_.isNil(styles.maxWidth) ? styles.maxWidth : null,
      dataCellStyleResolver: styles.dataCellStyleResolver || null
    };

    if (!this.config.heading && !this.config.noHeading){
      let tempHeading = this.config.key;
      this.config.heading = '';

      tempHeading.split('.').forEach((name, index)=>{
        this.config.heading += _.startCase(name) + ' ';
      });
    }

    this.options = options;
  }
}

export interface GridDataFormatter {
  column: GridColumn;
  row: any;
}

@Component({
  template: `{{getValue()}}`
})
export class GridPropertyFormatter implements GridDataFormatter {
  @Input() column: GridColumn;
  @Input() row: RowContext;

  getValue(){
    return _.get(this.row.data, this.column.config.key);
    /*
    try {
      return eval(`this.row.data.${this.column.config.key}`);
    } catch (error){
      return null;
    }
    */
  }
}

@Component({
  template: `{{getValue() || '' | date : getFormat()}}`
})
export class GridDateFormatter extends GridPropertyFormatter {
  @Input() column: GridColumn;
  @Input() row: RowContext;

  constructor(@Optional() @Inject(AM_GRID_DATE_FORMAT) public gridDateFormat: GridDateFormat){
    super();
    //console.log("=======================***> ", this.gridDateFormat);
    if (!gridDateFormat){
      //console.log("DHO!!@ ", this.gridDateFormat);
      this.gridDateFormat = {
        format: 'fullDate'
      }
    }
  }

  getFormat(){
    return this.column.options.dateFormat || this.gridDateFormat.format;
  }
}

export interface GridHeaderFormatter {
  column: GridColumn;
}

@Component({
  template: `{{column.config.heading}}`
})
export class GridKeyHeaderFormatter implements GridHeaderFormatter {
  @Input() column: GridColumn;
}

export interface GridExpanderFormatter {
  row: RowContext;
}

//=====[ GRID DEFAULTS ]==============================================================================================================================

export class GridDefaults {

  columns : Map<string, GridColumn> = new Map();

  constructor(){
    let dateCol = new GridColumn({
      type: 'date',
      key: 'date',
      formatter: GridDateFormatter
    },{

    },{
      //dateFormat: 'fullDate'
    });

    let textCol = new GridColumn({type: 'text', key: 'text', formatter: GridPropertyFormatter });

    this.setDefaultColumn(dateCol.config.type, dateCol);
    this.setDefaultColumn(textCol.config.type, textCol);
  }

  setDefaultColumn(type: string, column: GridColumn){
    this.columns.set(type, column);
  }

  getDefaultColumn(type: string) : GridColumn {
    return this.columns.get(type);
  }

  applyDefaults(columns: GridColumn[]){
    if (!columns || columns.length == 0){
      return;
    }

    columns.forEach((column, index)=>{
      let defaultColumn = this.getDefaultColumn(column.config.type);
      if (defaultColumn){
        _.defaultsDeep(column, defaultColumn);
        //console.log(column);
      }
    });
  }
}
