import {Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {
  GridModel,
  GridColumn,
  DatePropertyFormatter,
  RowDataFormatter,
  PropertyFormatter,
  CriteriaTableDB,
  FunctionCriteriaLoader,
  HeaderFormatter, GridService
} from "@bi8/am-data-table";

import {MdPaginator} from "@angular/material";

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
    total: 3,
    results: [
      { lastModified: new Date(), company: { name: "XIB Solutions"}, firstName: 'Manie', lastName: 'Coetzee', address: '13 Pioneer Road' },
      { lastModified: new Date(), company: { name: "Marvel"}, firstName: 'Peter', lastName: 'Parker', address: '9 Malibu' },
      { lastModified: new Date(), company: { name: "DC Universe"}, firstName: 'Tony', lastName: 'Stark', address: '14 New York' }
    ]
  };

  constructor(public gridService: GridService) {
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
export class SadHeadingFormatter implements HeaderFormatter {
  @Input() column: GridColumn;
}

@Component({
  template: `<button md-button (click)="column.context.edit(row)">Edit</button>`
})
export class ActionFormatter extends PropertyFormatter {
}