import { Component } from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ColDef, GridOptions} from "ag-grid-community";
import {ToastrService} from "ngx-toastr";
import { take } from "rxjs";
import { BackEndService } from "../services/back-end.service";

const GET_DASHBOARD_DATA = '/dashboard/'

@Component({
  selector: 'app-dashboard',
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
    }
  }

  public dashboardData: any | null = null;

  constructor(private toastr: ToastrService, private backEndService: BackEndService) {
    this.columnDefs.forEach((column) => {
      column.resizable = true;
    })
    this.toastr.success('Inventory management System', 'Welcome');
    this.getDashboardData();
  }

  getDashboardData() {
    this.backEndService.getRequest(GET_DASHBOARD_DATA)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.dashboardData = response }
      )
  }

}
