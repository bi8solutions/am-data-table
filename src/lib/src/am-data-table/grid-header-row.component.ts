import {
  AfterContentChecked, AfterViewInit, Component, ComponentFactoryResolver, Input, IterableDiffers, OnChanges, OnDestroy, OnInit, SimpleChanges, Type,
  ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import {GridModel} from "./grid-model";
import {HeaderFormatter, RowDataFormatter} from "./grid-formatter";
import {GridHeaderCellDirective} from "./grid-header-cell.directive";
import {GridService} from "./grid.service";
import {GridColumn} from "./grid-column";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'grid-header-row',
  template: `
    <ng-container>
      <div *ngFor="let col of columns" class="am-header-cell" [ngStyle]="{'flex': col.styles.flex}">
      
        <ng-container grid-header-cell></ng-container>
      </div>
    </ng-container>
  `,
  styleUrls: ['./grid-header-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridHeaderRowComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() model: GridModel;
  @ViewChildren(GridHeaderCellDirective) cells: GridHeaderCellDirective[];
  columns: GridColumn[];
  modelSubscription: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              protected _differs: IterableDiffers,
              public gridService: GridService){
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.modelSubscription = this.model._changes.debounceTime(10).subscribe((columns: GridColumn[])=>{
      this.columns = columns;
      this.renderHeaders();
    });

    this.renderHeaders();
  }

  ngOnDestroy(): void {
    console.log("header row destroyed");
    if (this.modelSubscription){
      this.modelSubscription.unsubscribe();
    }
  }

  renderHeaders(){
    //this.gridService.applyDefaults(this.model.columns);
    console.log("rendering headers");

    setTimeout(()=>{
      this.cells.forEach((cell: GridHeaderCellDirective, index)=>{
        let formatter: Type<HeaderFormatter> = this.columns[index].config.headingFormatter;

        if (formatter){
          let componentFactory = this.componentFactoryResolver.resolveComponentFactory(formatter);

          let viewContainerRef = cell.viewContainerRef;
          viewContainerRef.clear();

          let componentRef = viewContainerRef.createComponent(componentFactory);
          (<HeaderFormatter>componentRef.instance).column = this.model.columns[index];

        } else {
          console.warn(`Could not find header formatter for column with key '${this.columns[index].config.key}'`);
        }
      });
    }, 0);
  }
}