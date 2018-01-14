import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {GridColumn, GridComponent, GridModel} from "./modules/am-data-table/grid";
import {ArrayDS} from "./modules/am-data-table/grid-array.ds";
import {MatPaginator} from "@angular/material";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  

  gridModel: GridModel;
  data: any[] = [];

  arrayDS : ArrayDS;
  message: string = 'Hello World';

  @ViewChild("firstNameHeaderTemplate") private firstNameHeaderTemplate: TemplateRef<any>;
  @ViewChild("alternateFirstNameNameHeaderTemplate") private alternateFirstNameTemplate: TemplateRef<any>;
  @ViewChild("firstNameDataTemplate") private firstNameDataTemplate: TemplateRef<any>;
  @ViewChild("expanderTemplate") private expanderTemplate: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  firstNameColumn: GridColumn;
  peterParker: any;

  @ViewChild("grid") private grid: GridComponent<any>;

  constructor() {
  }

  toggleExpander(){
    console.log(this.grid);
    this.grid.toggleRowExpander(0);
  }

  ngOnInit(): void {
    console.log("============?> ", this.paginator);
    this.arrayDS = new ArrayDS(this.paginator);
    

    this.peterParker = {
      firstName: "Peter", lastName: "Parker", nickName: 'Spiderman', email: "peter.parekr@marvel.com", mobile: "082444", landLine: "0215649595"
    };

    this.arrayDS.addItem(this.peterParker);
    this.arrayDS.addItem({ firstName: "Bruce", lastName: "Wayne", nickName: 'Batman', email: "bruce.wayne@dc.com", mobile: "082444", landLine: "0215649595", insertedColumn: "Blaf" });

    this.firstNameColumn = new GridColumn({
      key: 'firstName',
      headingTemplate: this.firstNameHeaderTemplate,
      dataTemplate: this.firstNameDataTemplate
    });

    this.gridModel = new GridModel({
      showExpander: true,
      expanderTemplate: this.expanderTemplate,
      expandRowIndex: 1,
    }, {
      minColumnWidth: "100px"
    });
setTimeout(() => {
  this.gridModel.config.expandRowIndex = 0;
}, 20000);
    this.firstNameColumn.styles.headerCellStyleClasses = ['some-class'];
    this.gridModel.addColumn(this.firstNameColumn);
    this.gridModel.addColumn(new GridColumn({key: 'lastName'}, {flex: 1}));
    this.gridModel.addColumn(new GridColumn({key: 'nickName'}, {flex: 3}));
    this.gridModel.addColumn(new GridColumn({key: 'email'}, {flex: 1}));
    this.gridModel.addColumn(new GridColumn({key: 'mobile'}, {flex: 1}));
    this.gridModel.addColumn(new GridColumn({key: 'landLine'}, {flex: 3}));    
  }

  reload(){
    this.arrayDS.reload();
  }

  addColumn(){
    this.gridModel.addColumn(new GridColumn({key: 'anotherFirstNameColumn', headingTemplate: this.firstNameHeaderTemplate}));
    //this.gridModel.addColumn(new GridColumn({key: 'anotherFirstNameColumn'}));
  }

  insertColumn(index: number){
    this.firstNameColumn.config.headingTemplate = this.alternateFirstNameTemplate;
    this.gridModel.updateColumn(this.firstNameColumn);

    //this.firstNameColumn.markForUpdate();
    this.gridModel.insertColumn(new GridColumn({key: `insertedColumn`}), index);
  }

  removeColumn(index: number){
    this.gridModel.removeColumnByIndex(index);
  }

  addRow(){
    this.arrayDS.addItem({
      firstName: "Manie",
      lastName: "Coetzee",
      nickName: 'Blaf',
      email: "mc@bla.bla.xom",
      mobile: "082444",
      landLine: "0215649595",
      anotherFirstNameColumn: "Blaf"
    })
  }

  insertRow(index: number){
    this.arrayDS.insertItem({
      firstName: "Manie",
      lastName: "Coetzee",
      nickName: 'Blaf',
      email: "mc@bla.bla.xom",
      mobile: "082444",
      landline: "021"
    }, index);
  }

  removeRow(index: number){
    this.arrayDS.removeItemByIndex(index);
  }

  updateFirstName(){
    this.arrayDS.items[0].lastName = "Bla die Bla Bla Bla";
  }
}
