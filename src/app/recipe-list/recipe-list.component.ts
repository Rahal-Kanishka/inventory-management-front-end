import { Component, ViewChild } from '@angular/core';
import { IngredientEditComponent } from "../ingredient-edit/ingredient-edit.component";
import { RecipeAddComponent } from "../recipe-add/recipe-add.component";
import { ColDef, GridOptions } from "ag-grid-community";
import { IngredientAddComponent } from "../ingredient-add/ingredient-add.component";
import { RecipeEditComponent } from "../recipe-edit/recipe-edit.component";
import { take } from "rxjs";
import { BackEndService } from "../services/back-end.service";
import { EditCellComponent } from "../common/edit-cell/edit-cell.component";
import { ViewAndEditCellComponent } from "../common/view-and-edit-cell/view-and-edit-cell.component";

const GET_RECIPE = '/recipe/view_all'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent {

  @ViewChild(RecipeAddComponent) recipeAddComponent!: RecipeAddComponent;
  @ViewChild(RecipeEditComponent) recipeEditComponent!: RecipeEditComponent;

  context = { componentParent: this };
  recipeList: any[] = [];
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name' },
    { field: 'description' },
    {
      field: '',
      cellRenderer: ViewAndEditCellComponent
    }
  ];

  constructor(private backEndService: BackEndService) {
    this.getRecipeData()
  }

  getRecipeData() {
    this.backEndService.getRequest(GET_RECIPE)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.recipeList = response }
      )
  }

  openModalFromCellRenderer(data: any) {
    // Pass the data to the modal component
    console.log('call from ell renderer')
    this.recipeEditComponent.openEditModal(data);
  }

  onAddModalClosed($event: any) {

  }

  onEditModalClosed($event: any) {

  }

  openModal() {

  }
}
