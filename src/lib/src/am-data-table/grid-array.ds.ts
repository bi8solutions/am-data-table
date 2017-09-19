import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DataSource} from "@angular/cdk/collections";
import {MdPaginator} from "@angular/material";
import {Observable} from "rxjs/Observable";

import * as _ from 'lodash';

export class ArrayDS extends DataSource<any[]> {

  itemSource$ = new BehaviorSubject<any[]>([]);
  items: any[] = [];

  pageSize: number = 5;
  pageIndex: number = 0;
  totalSize: number = 0;

  constructor(private paginator?: MdPaginator) {
    super ();

    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.reload();
      });
    }
  }

  connect(): Observable<any[]> {
    return this.itemSource$.asObservable();
  }

  disconnect(): void {
  }

  reload(){
    this.totalSize = this.items.length;
    let pages = _.chunk(this.items, this.pageSize);
    this.itemSource$.next(pages[this.pageIndex]);
  }

  addAll(items: any[]){
    this.items = this.items.concat(items);
    this.reload();
  }

  addItem(item: any){
    this.items.push(item);
    this.reload();
  }

  insertItem(item: any, index: number){
    this.items.splice(index, 0, item);
    this.reload();
  }

  removeColumn(item: any){
    this.items = _.without(this.items, item);
    this.reload();
  }

  removeItemByIndex(index: number){
    this.items.splice(index, 1);
    this.reload();
  }

  removeAll(){
    this.items = [];
    this.reload();
  }
}

