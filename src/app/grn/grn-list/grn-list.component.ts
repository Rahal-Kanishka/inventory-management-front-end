import { Component, ViewChild } from '@angular/core';
import { LocationAddComponent } from "../../location-add/location-add.component";
import { LocationEditComponent } from "../../location-edit/location-edit.component";
import { BackEndService } from "../../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
import { ColDef } from "ag-grid-community";
import { EditCellComponent } from "../../common/edit-cell/edit-cell.component";
import { GrnAddComponent } from "../grn-add/grn-add.component";
import { GrnEditComponent } from "../grn-edit/grn-edit.component";

const GET_GRN = '/grn/view_all/'

@Component({
  selector: 'app-grn-list',
  templateUrl: './grn-list.component.html',
  styleUrl: './grn-list.component.css'
})
export class GrnListComponent {
  @ViewChild(GrnAddComponent) grnAddComponent!: GrnAddComponent;
  @ViewChild(GrnEditComponent) grnEditComponent!: GrnEditComponent;

  grnList: any[] = []
  constructor(private backEndService: BackEndService, private toastrService: ToastrService) {
    this.getGRNListData();
  }

  public getGRNListData() {
    this.backEndService.getRequest(GET_GRN)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.grnList = response }
      )
  }
  openModal() {
    this.grnAddComponent.openGRNAddModal();
  }

  context = { componentParent: this };

  openModalFromCellRenderer(data: any) {
    // Pass the data to the modal component
    this.grnEditComponent.openEditModal(data);
  }

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'issuedDate',
      minWidth: 180,
      valueFormatter: (params: any) => {
        if (params.data && params.data.issuedDate	) {
          const date = new Date(params.data.issuedDate	);
          return date.toLocaleString(); // Format the date as 'MM/DD/YYYY, HH:mm:ss'
        }
        return 'No Date Provided'
      }
    },
    { field: 'ingredients', headerName: 'Ingredients',
      valueFormatter: (params: any) =>( !params && !params.data && !params.data.ingredients ) ? 0: params.data?.ingredients.length,
      cellStyle: function(params) {
        if (params && params.data && params.data.ingredients && params.data.ingredients.length > 1) {
          return { color: 'green' };
        } else {
          return { color: 'black' };
        }
      } },
    {
      field: '',
      cellRenderer: EditCellComponent
    }
  ];

  onGrnAddModalClosed($event: any) {
    console.log('GRN add: ', $event)
    this.grnList = [...this.grnList, $event]
  }

  onGrnEditModalClosed(updatedGRN: any) {
    let tempList = []
    for (let item of this.grnList){
      if (updatedGRN.id != item.id){
        tempList.push(item)
      } else {
        tempList.push(updatedGRN)
      }
    }
    // to trigger grid update
    this.grnList = [...tempList];
  }
}
