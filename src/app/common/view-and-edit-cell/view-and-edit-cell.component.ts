import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-view-and-edit-cell',
  template: `
    <p>
      <button class="btn btn-primary" style="width: 40%; margin-top: 1.5px;padding: 7px"
              (click)="openViewAndEditModal()">View & Edit
      </button>
    </p>
  `,
  styles: ``
})
export class ViewAndEditCellComponent implements OnInit, ICellRendererAngularComp {

  private params: any;

  constructor() {
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  ngOnInit(): void {
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  openViewAndEditModal() {
    // Call the parent's openModalFromCellRenderer function, passing in the data for this row
    console.log('open modal: ', this.params.data);
    this.params.context?.componentParent?.openModalFromCellRenderer(this.params.data);
  }


}
