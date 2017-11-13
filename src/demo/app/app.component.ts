import {Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {
  GridModel,
  GridComponent,
  GridColumn,
  CriteriaTableDB,
  FunctionCriteriaLoader,
  GridService,

  GridHeaderFormatter,
  GridPropertyFormatter, ArrayDS
} from "@bi8/am-data-table";

import {MdPaginator} from "@angular/material";

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html' ,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  gridModel: GridModel;
  data: any[] = [];

  arrayDS : ArrayDS;
  message: string = 'Hello World';

  @ViewChild("firstNameHeaderTemplate") private firstNameHeaderTemplate: TemplateRef<any>;
  @ViewChild("alternateFirstNameNameHeaderTemplate") private alternateFirstNameTemplate: TemplateRef<any>;
  @ViewChild("firstNameDataTemplate") private firstNameDataTemplate: TemplateRef<any>;
  @ViewChild("expanderTemplate") private expanderTemplate: TemplateRef<any>;

  @ViewChild(MdPaginator) paginator: MdPaginator;

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
    }, {
      minColumnWidth: "100px"
    });

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

@Component({
  template: `{{column.heading}} :(`
})
export class SadHeadingFormatter implements GridHeaderFormatter {
  @Input() column: GridColumn;
}

@Component({
  template: `<button md-button (click)="column.config.context.edit(row)">Edit</button>`
})
export class ActionFormatter extends GridPropertyFormatter {
}



/*
@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html' ,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  model: GridModel;
  db: CriteriaTableDB;
  duff: string = "Hellooooooooo!";

  @ViewChild("myTemplate") private myTemplate: TemplateRef<any>;
  @ViewChild("addressFormatter") private addressFormatter: TemplateRef<any>;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  data = {
    total: 10,
    results: [
      /!*{ lastModified: new Date(), company: { name: "XIB Solutions"}, firstName: 'Manie', lastName: 'Coetzee', address: '13 Pioneer Road' },
      { lastModified: new Date(), company: { name: "Marvel"}, firstName: 'Peter', lastName: 'Parker', address: '9 Malibu' },
      { lastModified: new Date(), company: { name: "DC Universe"}, firstName: 'Tony', lastName: 'Stark', address: '14 New York' }*!/
    ]
  };

  constructor(public gridService: GridService) {
    for (let i = 0; i < 10; i++){
      this.data.results.push({ lastModified: new Date(), company: { name: "Marvel"}, firstName: 'Peter', lastName: 'Parker', address: '9 Malibu' });
    }
  }

  ngOnInit(): void {
    this.model = new GridModel({}, {scrollX: true, minWidth: "1000px"});

    this.model.addColumn(new GridColumn({type: 'date', key: 'lastModified'}, {flex: 2}));
    this.model.addColumn(new GridColumn({key: 'firstName'}));
    this.model.addColumn(new GridColumn({key: 'company.name'}));
    this.model.addColumn(new GridColumn({
      key: 'address',
      heading: 'Address',
      dataTemplate: this.addressFormatter
    }));

    this.model.addColumn(new GridColumn({
      key: 'actions',
      heading: 'Actions',
      formatter: ActionFormatter,
      context: this,
    }));

    this.db = new CriteriaTableDB(new FunctionCriteriaLoader(criteria => this.loadData({})), this.paginator);
    this.reload();
  }

  edit(row){
    console.log("Editing away!!!!!!!!!!!!!!!!!!" + row);
  }

  addRow(){
    this.data.total = this.data.total+1;
    this.data.results.push({ lastModified: new Date(), company: { name: "Nowhere Inc"}, firstName: 'Jack', lastName: 'Dibbler', address: 'The Farside' });
  }

  addColumn(){
    this.model.removeAll();

    this.model.addColumn(new GridColumn({type: 'date', key: 'lastModified' }));
    this.model.addColumn(new GridColumn({key: 'firstName'}));
    this.model.addColumn(new GridColumn({key: 'company.name'}));

    this.model.addColumn(new GridColumn({
      key: 'address',
      heading: 'Address',
      dataTemplate: this.addressFormatter
    }));

    this.model.addColumn(new GridColumn({
      key: 'actions',
      heading: 'Actions',
      formatter: ActionFormatter,
      context: this,
    }));

    this.model.addColumn(new GridColumn({
      key: 'lastName',
      heading: 'Last Name',
      headingFormatter: SadHeadingFormatter
    }));
  }

  removeColumn(){
    this.model.removeColumnsByKey('lastName');
  }

  reload(){
    this.db.reload({});
  }

  loadData(criteria: any) : Observable<Object>{
    return Observable.of(this.data);
  }
}

@Component({
  template: `{{column.heading}} :(`
})
export class SadHeadingFormatter implements GridHeaderFormatter {
  @Input() column: GridColumn;
}

@Component({
  template: `<button md-button (click)="column.config.context.edit(row)">Edit</button>`
})
export class ActionFormatter extends GridPropertyFormatter {
}*/
