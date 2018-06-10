import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  AM_GRID_DATE_FORMAT, DataRowStyleResolver,
  GridColumn,
  GridComponent,
  GridDateFormat,
  GridEvent,
  GridEventType,
  GridModel,
  RowContext
} from "./modules/am-data-table/grid";
import {ArrayDS} from "./modules/am-data-table/grid-array.ds";
import {MatPaginator} from "@angular/material";

const MY_FORMAT : GridDateFormat = {
  format: 'MM'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: AM_GRID_DATE_FORMAT, useValue: MY_FORMAT }
  ]

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
    this.grid.toggleRowExpander(1);
  }

  ngOnInit(): void {
    console.log("============?> ", this.paginator);
    this.arrayDS = new ArrayDS(this.paginator);


    this.peterParker = {
      date: new Date(), firstName: "Peter", lastName: "Parker", nickName: 'Spiderman', email: "peter.parekr@marvel.com", mobile: "082444", landLine: "0215649595"
    };

    this.arrayDS.addItem(this.peterParker);
    this.arrayDS.addItem({ date: new Date(), firstName: "Bruce", lastName: "Wayne", nickName: 'Batman', email: "bruce.wayne@dc.com", mobile: "082444", landLine: "0215649595", insertedColumn: "Blaf" });

    this.firstNameColumn = new GridColumn({
      key: 'firstName',
      headingTemplate: this.firstNameHeaderTemplate,
      dataTemplate: this.firstNameDataTemplate
    });

    this.gridModel = new GridModel({
      showExpander: true,
      expanderTemplate: this.expanderTemplate,
      expandRowIndex: 0
    }, {
      minColumnWidth: "100px"
    });

    /*let example: DataRowStyleResolver = (row: RowContext) => {
      return ['pink'];
    }*/

    /*
    (row: RowContext)=> {

            let bla = ['pink'];
            return bla;
          }
     */

setTimeout(() => {
  //this.gridModel.config.expandRowIndex = 0;
}, 20000);
    this.firstNameColumn.styles.headerCellStyleClasses = ['some-class'];
    this.gridModel.addColumn(this.firstNameColumn);
    this.gridModel.addColumn(new GridColumn({key: 'date', type: 'date'}, {}, {dateFormat: 'HH:mm'}));
    this.gridModel.addColumn(new GridColumn({key: 'date', type: 'date', heading: 'Global Date'}));
    this.gridModel.addColumn(new GridColumn({key: 'lastName'}, {flex: 1}, {}));
    this.gridModel.addColumn(new GridColumn({key: 'nickName'}, {flex: 3}));
    this.gridModel.addColumn(new GridColumn({key: 'email'}, {flex: 1}));
    this.gridModel.addColumn(new GridColumn({key: 'mobile'}, {flex: 1}));
    this.gridModel.addColumn(new GridColumn({key: 'landLine'}, {flex: 3}));

    /*setTimeout(()=>{
      this.grid.toggleRowExpander(1);
    }, 0);*/

  }

  reload(){
    this.arrayDS.reload();
  }

  tickle(){
    console.log("===>", this.arrayDS.items[1].email);
    this.arrayDS.items[1].email = 'duff';
    //this.gridModel.updateStyles();
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

  gridEvent(event: GridEvent){
    if (event.type == GridEventType.Initialized){
      //this.gridModel.toggleExpander(0);
    }
  }
}
