import { Component, ViewChild } from '@angular/core';
import { RecipeAddComponent } from "../../recipe-add/recipe-add.component";
import { RecipeEditComponent } from "../../recipe-edit/recipe-edit.component";
import { ColDef } from "ag-grid-community";
import { ViewAndEditCellComponent } from "../../common/view-and-edit-cell/view-and-edit-cell.component";
import { ProductAddComponent } from "../product-add/product-add.component";
import { ProductEditComponent } from "../product-edit/product-edit.component";
import { take } from "rxjs";
import { BackEndService } from "../../services/back-end.service";
import { EditCellComponent } from "../../common/edit-cell/edit-cell.component";

const GET_PRODUCT = '/product/all'
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  @ViewChild(ProductAddComponent) productAddComponent!: ProductAddComponent;
  @ViewChild(ProductEditComponent) productEditComponent!: ProductEditComponent;

  context = { componentParent: this };
  productList: any[] = [];
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', maxWidth: 80 },
    { field: 'name', maxWidth: 100 },
    { field: 'type', maxWidth: 150 },
    { field: 'description' },
    { field: 'selling_price', headerName: 'Price',  maxWidth: 100,
      valueFormatter: params => params.data.selling_price.toFixed(2),
      cellStyle: function(params) {
        if (parseFloat(params.data.selling_price) < 1.00) {
          return { color: 'red' };
        } else {
          return { color: 'green' };
        }
      }
    },
    { field: 'batch_size', headerName: 'Batch Size',  maxWidth: 120},
    { field: 'expire_duration', headerName: 'Expire Duration'},
    { field: 'recipe',
      valueFormatter: (params: any) =>( !params && !params.data && !params.data.recipe ) ? 'No Recipe': params.data?.recipe.name,
    },
    {
      field: '',
      cellRenderer: EditCellComponent
    }
  ];

  constructor(private backEndService: BackEndService) {
    this.getProductData();
  }

  getProductData() {
    this.backEndService.getRequest(GET_PRODUCT)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.productList = response }
      )
  }

  openModalFromCellRenderer(data: any) {
    // Pass the data to the modal component
    console.log('call from ell renderer')
    this.productEditComponent.openEditModal(data);
  }

  openAddModal() {
    this.productAddComponent.openAddProductModal();
  }

  onAddModalClosed($event: any) {
    console.log('product add: ', $event)
    // make it compatible to the grid data
    $event = {...$event, users: [] }
    this.productList = [...this.productList, $event]
  }
  onEditModalClosed(updatedLocation: any) {
    let tempList = []
    for (let ingredient of this.productList){
      if (updatedLocation.id != ingredient.id){
        tempList.push(ingredient)
      } else {
        tempList.push(updatedLocation)
      }
    }
    // to trigger grid update
    this.productList = [...tempList];
  }
}
