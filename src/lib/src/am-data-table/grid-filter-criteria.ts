import {Observable} from "rxjs/Observable";

export enum Operation {
  gt,     // > Greater Than
  lt,     // > Lower Than
  gte,    // >= Greater or Equal
  lte,    // <= Lower or Equal
  eq,     // =
  ieq,    // : case insensitive equal (can only be done on strings)
  neq,    // != not equal
  ineq,   // !: case insensitive not equal (can only be done on strings)
  like,   // like
  ilike   // case insensitive like
}

export enum SortOrder {
  asc,   // Ascending
  desc   // Descending
}

export interface SearchContext {
  size?: number;
  page?: number;
  inclusive?: boolean;
  sortField?: string;
  sortOrder?: SortOrder;
  criteria?: FilterCriteria[];
}

export interface FilterCriteria {
  path: string;
  operation: Operation;
  value: any;
}

export function SelectionMapper(codeProperty: string, valueProperty: string, source$: Observable<Object>) : Observable<Object> {
  return source$.map((response : any) => {
    response.results.forEach((item, index)=>{
      item.code = item[codeProperty];
      item.value = item[valueProperty];
    });
    return response.results;
  });
}

export function StringSelectionMapper(source$: Observable<Object>) : Observable<Object> {
  return source$.map((response : any) => {
    let values = [];

    response.results.forEach((item, index)=>{
      values.push({ code: item, value: item });
    });
    return values;
  });
}

export class FilterCriteriaUtils {
  constructor(private ctx?: SearchContext){
    if (!ctx){
      this.ctx = {};
    }
  }

  getContext() : SearchContext {
    return this.ctx;
  }

  applyFilter(path: string, operation: Operation, value: any) : FilterCriteriaUtils {
    if (!value){
      return;
    }

    let filter: FilterCriteria = {
      path: path,
      operation: operation,
      value: value
    };

    if (!this.ctx.criteria){
      this.ctx.criteria = [];
    }

    this.ctx.criteria.push(filter);
    return this;
  }

  format(){
    let result: any = {};
    if (this.ctx.size) {
      result.size = this.ctx.size;
    }

    if (this.ctx.page){
      result.page = this.ctx.page;
    }

    if (this.ctx.inclusive != undefined){
      result.inclusive = this.ctx.inclusive;
    }

    if (this.ctx.sortField != undefined){
      result.sortField = this.ctx.sortField;
    }

    switch (this.ctx.sortOrder){
      case SortOrder.asc:
        result.sortOrder = 'asc';
        break;
      case SortOrder.desc:
        result.sortOrder = 'desc';
        break;
    }

    if (this.ctx.criteria && this.ctx.criteria.length > 0){
      result.criteria = [];
      for (let filter of this.ctx.criteria){
        let fc: any = {
          value: filter.value,
          path: filter.path
        };

        switch (filter.operation){
          case Operation.eq:
            fc.operation = '=';
            break;
          case Operation.gt:
            fc.operation = '>';
            break;
          case Operation.gte:
            fc.operation = '>=';
            break;
          case Operation.ilike:
            fc.operation = 'ilike';
            break;
          case Operation.like:
            fc.operation = 'like';
            break;
          case Operation.lt:
            fc.operation = '<';
            break;
          case Operation.lte:
            fc.operation = '<=';
            break;
          case Operation.ieq:
            fc.operation = ':';
            break;
          case Operation.neq:
            fc.operation = '!=';
            break;
          case Operation.ineq:
            fc.operation = '!:';
            break;
        }

        result.criteria.push(fc);
      }
    }

    return result;
  }
}
