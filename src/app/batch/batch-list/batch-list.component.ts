import { Component, ViewChild } from '@angular/core';
import { ColDef } from "ag-grid-community";
import { EditCellComponent } from "../../common/edit-cell/edit-cell.component";
import { BackEndService } from "../../services/back-end.service";
import { take } from "rxjs";
import { BatchAddComponent } from "../batch-add/batch-add.component";

const GET_BATCHES = '/batch/all'
@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.css'
})
export class BatchListComponent {


  @ViewChild(BatchAddComponent) batchAddComponent!: BatchAddComponent;

  context = { componentParent: this };
  batchList: any[] = [];
  gridOptions = {
    autoSizeStrategy: {
      type: 'fitCellContents'
    },

    // other grid options ...
  }
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 50},
    { field: 'name', minWidth: 300, },
    { field: 'Product',
      minWidth: 140,
      valueFormatter: function (params){
        return params?.data?.product?.name
      } },
    { field: 'Product Type',
      headerName: 'Type',
      maxWidth: 120,
      valueFormatter: function (params){
      return params?.data?.product?.type
      } },
    { field: 'productionDate',
      headerName: 'Created On',
      valueFormatter: (params: any) => {
        if (params.data && params.data?.productionDate) {
          const date = new Date(params.data?.productionDate);
          return date.toLocaleString().split(',')[0]; // get only the date
        }
        return 'No Date Provided'
      }},
    { field: 'dateOfExpiry',
      headerName: 'Expire On',
      valueFormatter: (params: any) => {
        if (params.data && params.data?.dateOfExpiry) {
          const date = new Date(params.data?.dateOfExpiry);
          return date.toLocaleString().split(',')[0]; // get only the date
        }
        return 'No Date Provided'
      }},
    { field: 'initialQuantity', headerName: 'Initial' },
    { field: 'availableQuantity', headerName: 'Available',
      cellStyle: function(params) {
        if (params && params?.data && params.data?.availableQuantity) {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      }
    }
  ];

  constructor(private backEndService: BackEndService) {
    this.getRecipeData()
  }

  getRecipeData() {
    this.backEndService.getRequest(GET_BATCHES)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.batchList = response }
      )
  }

  onAddModalClosed($event: any) {
    this.batchList = [...this.batchList, $event];
  }

  onEditModalClosed($eventData: any) {
    let tempList = []
    for (let recipe of this.batchList){
      if ($eventData.id != recipe.id){
        tempList.push(recipe)
      } else {
        tempList.push($eventData)
      }
    }
    // to trigger grid update
    this.batchList = [...tempList];
  }

  openModal() {
    this.batchAddComponent.openAddBatchModal();
  }

}
