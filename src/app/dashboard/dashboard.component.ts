import { Component } from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ColDef, GridOptions} from "ag-grid-community";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AgGridAngular
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  rowData = [
    { make: 'Beer', model: 'Corona', price: 35000, quantity: 28, ExpiresOn: 'December' },
    { make: 'Beer', model: 'Mondeo', price: 32000, quantity: 13,  ExpiresOn: 'November' },
    { make: 'Whisky', model: 'Mondeo', price: 32000, quantity: 13,  ExpiresOn: 'November' },
    { make: 'Beer', model: 'Corona2', price: 32000, quantity: 13,  ExpiresOn: 'November' },
    { make: 'Brandy', model: 'Mondeo', price: 32000, quantity: 13,  ExpiresOn: 'November' },
    { make: 'Wine', model: 'Red Wine', price: 72000, quantity: 285,  ExpiresOn: 'October' }
  ];

  columnDefs: ColDef[] = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
    { field: 'quantity' },
    { field: 'ExpiresOn' },
  ];



  public gridOptions: GridOptions = {
    rowHeight: 45,
    autoSizeStrategy: {
      type: 'fitGridWidth'
    },
    getRowStyle: params => {
      if (params && params.node.rowIndex && params.node.rowIndex % 2 === 1) {
        return { background: 'gray' };
      } else {
        return { background: 'white' };
      }
  }
  }

  constructor() {
    this.columnDefs.forEach((column) => {
      column.resizable = true;
    })
  }

}
