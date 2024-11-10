import { Component, Input } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { ColDef, GridOptions } from "ag-grid-community";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  @Input() gridData: any[] = [];
  @Input() columnDefs: ColDef[] = [];

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

}