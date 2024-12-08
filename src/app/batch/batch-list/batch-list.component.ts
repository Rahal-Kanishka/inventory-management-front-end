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
    { field: 'id', headerName: 'ID',  maxWidth: 100 },
    { field: 'name', minWidth: 300, },
    { field: 'Product',
      maxWidth: 100,
      valueFormatter: function (params){
        return params?.data?.product?.name
      } },
    { field: 'Product Type', valueFormatter: function (params){
      return params?.data?.product?.type
      } },
    { field: 'initialQuantity' },
    { field: 'availableQuantity',
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
