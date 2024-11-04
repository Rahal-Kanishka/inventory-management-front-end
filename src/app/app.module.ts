import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AgGridModule} from "ag-grid-angular";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AgGridModule
  ],
  bootstrap: [

  ]
})
export class AppModule { }
