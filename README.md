# Angular Material Data Table

ng update @angular/cli --migrate-only --from=1.7.4
ng update @angular/core
yarn add ng-packagr
yarn add @angular/material
yarn add core-js
yarn add @angular/flex-layout
yarn add lodash
yarn add material-design-icons
yarn add roboto-fontface
yarn add zone.js
yarn add ts-node
yarn add tsickle
yarn add tslib
yarn add @angular/compiler-cli
yarn add rxjs-compat

AmDataTable is a simple library used to display tabular data  

Please note that this is a *Proof of Concept* library and not meant for production use and that the API can 
change at any time.

Version 5.0 is a update to the way the library gets build as well as depending on Angular5.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Installation

To install ADataTable in your project, simply do

```
npm i @bi8/am-data-table
```  

AmDataTable depends on/uses ```@bi8/am-storage``` and ```@bi8/am-logger```

## Configuration

Import the AmDataTableModule

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AmDataTable } from "@bi8/am-data-table";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmDataTableModule,
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
``` 

## Build

Run `npm i` to install all the dependencies. To create the bundle/distribution, run `npm run packagr`
which will do a new release under the dist folder. 

## Project Layout
This is basically a CLI generated application with the addition of [ng-packagr](https://www.npmjs.com/package/ng-packagr) to create the distribution 
bundle.  The app component imports the AmStorageModule that is located under the modules directory.  Only the module is packaged
an not the whole example project.  

Please see Nikolas LeBlanc's article: [Building an Angular 4 Component Library with the Angular CLI and ng-packagr](https://medium.com/@ngl817/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e) 

