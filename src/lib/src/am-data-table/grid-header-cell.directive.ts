import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[grid-header-cell]',
})
export class GridHeaderCellDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

