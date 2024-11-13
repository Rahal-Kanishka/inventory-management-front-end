import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { Observable, take } from "rxjs";
import { BackEndService } from "../services/back-end.service";
import { ColDef, GridOptions } from "ag-grid-community";
import { Modal } from 'bootstrap';
import { FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { IngredientAddComponent } from "../ingredient-add/ingredient-add.component";
import { EditCellComponent } from "../common/edit-cell/edit-cell.component";
import { IngredientEditComponent } from "../ingredient-edit/ingredient-edit.component";

const GET_INGREDIENTS = '/ingredient/all'
const ADD_INGREDIENTS = '/ingredient/add'

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css'
})
export class IngredientListComponent {

  @ViewChild(IngredientAddComponent) ingredientAddComponent!: IngredientAddComponent;
  @ViewChild(IngredientEditComponent) ingredientEditComponent!: IngredientEditComponent;

  openModal() {
    this.ingredientAddComponent.openModal();
  }

  context = { componentParent: this };

  openModalFromCellRenderer(data: any) {
    // Pass the data to the modal component
    this.ingredientEditComponent.openEditModal(data);
  }

  public ingredientList: any[] = []

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name' },
    { field: 'description' },
    { field: 'currentQuantity',
      cellStyle: function(params) {
        if (params.value > 0) {
          return {color: 'green'};
        } else {
          return {color: 'red'};
        }
      } },
    {
      field: '',
      cellRenderer: EditCellComponent
    }
  ];

  ingredientForm: FormGroup;

  constructor(private backEndService: BackEndService, private toastrService: ToastrService) {
    this.getIngredientData();
    document.getElementById('exampleModal')?.addEventListener('shown.bs.modal', () => {
      (document.getElementById('myInput') as HTMLInputElement)?.focus();
      console.log('haha')
    });

    this.ingredientForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl('')
    });
  }

  public gridOptions: GridOptions = {
    rowHeight: 45,
    autoSizeStrategy: {
      type: 'fitGridWidth'
    }
  }

  public getIngredientData() {
    this.backEndService.getRequest(GET_INGREDIENTS)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.ingredientList = response }
      )
  }

  onAddModalClosed(addedRecord: any) {
    this.ingredientList = [...this.ingredientList, addedRecord];
  }
  onEditModalClosed(addedRecord: any) {
    let tempList = []
    for (let ingredient of this.ingredientList){
      if (addedRecord.id != ingredient.id){
        tempList.push(ingredient)
      } else {
        tempList.push(addedRecord)
      }
    }
    // to trigger grid update
    this.ingredientList = [...tempList];
  }

  processResponseFromServer(recipe: any){

  }
}
