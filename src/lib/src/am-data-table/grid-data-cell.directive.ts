import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[grid-data-cell]',
})
export class GridDataCellDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

