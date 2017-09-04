import {
  AfterContentChecked, AfterViewInit, Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, Type, ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import {GridModel} from "./grid-model";
import {GridDataCellDirective} from "./grid-data-cell.directive";
import {HeaderFormatter, RowDataFormatter} from "./grid-formatter";
import {GridHeaderCellDirective} from "./grid-header-cell.directive";
import {GridColumn} from "./grid-column";
import {GridService} from "./grid.service";
import {Subscription} from "rxjs/Subscription";



@Component({
  selector: 'grid-data-row',
  template: `
    <ng-container>
      <div *ngFor="let col of columns" class="am-data-cell" [ngStyle]="{'flex': col.styles.flex}">
      
        <ng-template grid-data-cell></ng-template>
      </div>
    </ng-container>
  `,
  styleUrls: ['./grid-data-row.component.scss']
})
export class GridDataRowComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() model: GridModel;
  @Input() row: any;
  @ViewChildren(GridDataCellDirective) cells: GridDataCellDirective[];

  columns: GridColumn[];
  modelSubscription: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              public gridService: GridService){
  }

  ngOnInit(): void {
    console.log("row added!");
    this.columns = this.model.columns;
  }

  ngAfterViewInit(): void {
    this.modelSubscription = this.model._changes.debounceTime(10).subscribe((columns: GridColumn[])=>{
      this.columns = columns;
      this.renderCells();
    });

    this.renderCells();
  }

  ngOnDestroy(): void {
    console.log("data row destroyed");
    if (this.modelSubscription){
      this.modelSubscription.unsubscribe();
    }
  }

  renderCells(){
    console.log("rendering data cells");
    setTimeout(()=>{
      this.cells.forEach((cell: GridHeaderCellDirective, index)=>{

        let formatter: Type<HeaderFormatter> = this.columns[index].config.formatter;
        if (formatter) {
          let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.columns[index].config.formatter);
          let viewContainerRef = cell.viewContainerRef;
          viewContainerRef.clear();

          let column: GridColumn = this.columns[index];
          if (column.config.dataTemplate) {
            viewContainerRef.createEmbeddedView(column.config.dataTemplate, {column: column, row: this.row});

          } else {
            let componentRef = viewContainerRef.createComponent(componentFactory);
            (<RowDataFormatter>componentRef.instance).column = this.columns[index];
            (<RowDataFormatter>componentRef.instance).row = this.row;
          }
        } else {
          console.warn(`Could not find cell data formatter for column with key '${this.columns[index].config.key}'`);
        }
      });
    }, 0);
  }
}