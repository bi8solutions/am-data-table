import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {MdPaginator} from "@angular/material";
import {DataSource} from "@angular/cdk/collections";
import { Observable } from 'rxjs';

export interface CriteriaSearchService {
  search(criteria: any) : Observable<Object>
}

export interface CriteriaLoadFn {
  (criteria: any): Observable<Object>;
}

export interface CriteriaLoader {
  prepare(criteria: any) : Observable<Object>;
  processResponse(response: any) : any;
}

export class FunctionCriteriaLoader implements CriteriaLoader {
  constructor(public loadFn: CriteriaLoadFn){
  }

  prepare(criteria: any) : Observable<Object> {
    return this.loadFn(criteria).map((response : any)=>{
      return this.processResponse(response);
    });
  }

  processResponse(response){
    return {
      total: response.total,
      items: response.results
    }
  }
}

export class CriteriaTableDB {
  dataSubject = new BehaviorSubject<any[]>([]);
  dataSource: CriteriaTableDS | null;
  items: any = [];

  pageSize: number = 5;
  pageIndex: number = 0;
  totalSize: number = 0;

  constructor(private loader : CriteriaLoader,
              private paginator: MdPaginator){

    this.dataSource = new CriteriaTableDS(this.dataSubject);
    this.paginator.page.subscribe((event)=>{
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.reload();
    });
  }

  reload(ctx?: any){
    let criteria = ctx || {};
    criteria.page = this.pageIndex;
    criteria.size = this.pageSize;

    this.loader.prepare(criteria).subscribe((result: any)=>{
      this.items = result.items;
      this.totalSize = result.total;
      this.dataSubject.next(result.items);
    });
  }
}

export class CriteriaTableDS extends DataSource<any[]> {
  constructor(private subject: BehaviorSubject<any[]>) {
    super ();
  }

  connect(): Observable<any[]> {
    return this.subject.asObservable();
  }

  disconnect(): void {
  }
}
