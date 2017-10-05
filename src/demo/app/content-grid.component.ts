
import {Component, OnInit, ViewChild} from "@angular/core";
import {GridModel, ArrayDS, GridColumn} from "@bi8/am-data-table";
import {MdPaginator} from "@angular/material";

@Component({
  selector: 'content-grid',
  template: `
    <div class="mat-elevation-z1" style="display: flex; flex-direction: column; overflow: hidden;">
      <div class="container">
                      <div class="box">
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                        <div class="element">hello world - goodbye cruel world</div>
                      </div>
                    </div>
      <md-paginator #paginator
                    [length]="arrayDS.totalSize"
                    [pageIndex]="arrayDS.pageIndex"
                    [pageSize]="arrayDS.pageSize"
                    [pageSizeOptions]="[5, 10, 15, 20, 35, 50]"></md-paginator>
    </div>
  `
})
export class ContentGridComponent implements OnInit {

  gridModel: GridModel;
  data: any[] = [];
  arrayDS : ArrayDS;

  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(){
  }

  ngOnInit(): void {
    this.arrayDS = new ArrayDS(this.paginator);

    for (let i = 0; i < 10; i++){
      this.arrayDS.addItem({
        someColumn1: "Data Of Some Column 1",
        someColumn2: "Data Of Some Column 2",
        someColumn3: "Data Of Some Column 3",
        someColumn4: "Data Of Some Column 4",
        someColumn5: "Data Of Some Column 5",
        someColumn6: "Data Of Some Column 6",
        someColumn7: "Data Of Some Column 7",
        someColumn8: "Data Of Some Column 8",
        someColumn9: "Data Of Some Column 9",
        someColumn10: "Data Of Some Column 10",
        someColumn11: "Data Of Some Column 11",
        someColumn12: "Data Of Some Column 12",
        someColumn13: "Data Of Some Column 13",
        someColumn14: "Data Of Some Column 14",
        someColumn15: "Data Of Some Column 15",
        someColumn16: "Data Of Some Column 16",
        someColumn17: "Data Of Some Column 17",
        someColumn18: "Data Of Some Column 18",
      });
    }

    this.gridModel = new GridModel({}, {});

    this.gridModel.addColumn(new GridColumn({key: 'someColumn1'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn2'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn3'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn4'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn5'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn6'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn7'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn8'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn9'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn10'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn11'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn12'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn13'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn14'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn15'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn16'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn17'}, {flex: 1, minWidth: "200px"}));
    this.gridModel.addColumn(new GridColumn({key: 'someColumn18'}, {flex: 1, minWidth: "200px"}));

  }

}