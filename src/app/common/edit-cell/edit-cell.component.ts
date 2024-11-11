import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'app-edit-cell',
  template: `
    <button class="btn btn-primary" (click)="openEditModal()">Edit</button>
  `,
  styles: ``
})
export class EditCellComponent implements OnInit, ICellRendererAngularComp {

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


  openEditModal() {
    // Call the parent's openModalFromCellRenderer function, passing in the data for this row
    console.log('open modal: ', this.params.data);
    this.params.context?.componentParent?.openModalFromCellRenderer(this.params.data);
  }

}
