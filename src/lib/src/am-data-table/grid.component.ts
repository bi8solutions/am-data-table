import {
  AfterContentChecked, AfterViewInit, Component, ComponentFactoryResolver, ContentChildren, Input, isDevMode, IterableDiffer, IterableDiffers,
  NgIterable, OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges, TemplateRef, TrackByFunction, ViewChild,
  ViewChildren, ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";

import {GridModel} from "./grid-model";
import {GridDataRowComponent} from "./grid-data-row.component";
import {GridHeaderRowComponent} from "./grid-header-row.component";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {takeUntil} from "@angular/cdk/rxjs";
import {Subject} from "rxjs/Subject";
import {GridService} from "./grid.service";

import * as _ from 'lodash';

@Component({
  selector: 'am-data-grid',
  templateUrl: './grid.component.html' ,
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent<T> implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked, OnChanges, CollectionViewer {

  @Input() model: GridModel;
  rows: any[] = [];

  @ViewChildren(GridDataRowComponent) _rowDefinitions: QueryList<GridDataRowComponent>;
  @ViewChild(GridHeaderRowComponent) _headerRow: GridHeaderRowComponent;
  @ContentChildren(TemplateRef) templates: QueryList<TemplateRef<Object>>;

  private _onDestroy = new Subject<void>();
  private _renderChangeSubscription: Subscription | null;
  private _dataSource: DataSource<T>;

  viewChange = new BehaviorSubject<{start: number, end: number}>({start: 0, end: Number.MAX_VALUE});

  @Input()
  get dataSource(): DataSource<T> { return this._dataSource; }
  set dataSource(dataSource: DataSource<T>) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }

  classes: string = '';

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private vcRef: ViewContainerRef,
              private gridService: GridService){
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.model.notifyChanges();
  }

  ngAfterContentChecked(): void {
    if (this.dataSource && !this._renderChangeSubscription) {
      this._observeRenderChanges();
    }

    this._renderRowChanges();
    this.gridService.applyDefaults(this.model.columns);
  }

  _renderRowChanges(){
    /*
    if (this._rowDefinitions){
      this._rowDefinitions.forEach((row: GridDataRowComponent, index)=>{
        //row.doChangeCheck();
      });
    }
    if (this._headerRow){
      //this._headerRow.doChangeCheck();
    }
    */
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();

    if (this.dataSource) {
      this.dataSource.disconnect(this);
    }
  }

  private _switchDataSource(dataSource: DataSource<T>) {
    this.rows = [];

    if (this.dataSource) {
      this.dataSource.disconnect(this);
    }

    // Stop listening for data from the previous data source.
    if (this._renderChangeSubscription) {
      this._renderChangeSubscription.unsubscribe();
      this._renderChangeSubscription = null;
    }

    this._dataSource = dataSource;
  }

  private _observeRenderChanges() {
    this._renderChangeSubscription = takeUntil.call(this.dataSource.connect(this), this._onDestroy)
      .subscribe(data => {
        this.rows = data;
        this.model.notifyChanges();
      });
  }
}