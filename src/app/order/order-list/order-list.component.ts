import { Component, ViewChild } from '@angular/core';
import { ColDef, GridOptions } from "ag-grid-community";
import { BackEndService } from "../../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { AgGridAngular } from "ag-grid-angular";
import { OrderAddComponent } from "../order-add/order-add.component";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  @ViewChild(OrderAddComponent) orderAddComponent!: OrderAddComponent;

  context = { componentParent: this };

  rowData: any = []

  columnDefs: ColDef[] = [
    { field: 'id' },
    { field: 'name' },
    { field: 'quantity' },
    { field: 'batch_name', headerName: 'Batch' , minWidth: 300},
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



  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {
    this.getIngredientList();
  }

  private getIngredientList() {
    this.backEndService.getRequest('/order/all').subscribe(
      (response: any) => {
        this.rowData = response;
      },
      error => {
        this.toastrService.error('Error Occurred', 'Error')
      }
    )

  }

  onAddModalClosed($event: any) {
    this.rowData = [...this.rowData, $event];
  }

  openAddModal() {
    this.orderAddComponent.openAddOrderModal();
  }
}
