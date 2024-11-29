import { Component, ViewChild } from '@angular/core';
import { RecipeAddComponent } from "../recipe-add/recipe-add.component";
import { ColDef } from "ag-grid-community";
import { RecipeEditComponent } from "../recipe-edit/recipe-edit.component";
import { take } from "rxjs";
import { BackEndService } from "../services/back-end.service";
import { EditCellComponent } from "../common/edit-cell/edit-cell.component";

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
    { field: 'ingredients', headerName: 'Ingredients',
      valueFormatter: (params: any) =>( !params && !params.data && !params.data.ingredients ) ? 0: params.data?.ingredients.length,
      cellStyle: function(params) {
        if (params && params.data && params.data.ingredients && params.data.ingredients.length > 0) {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      }
      },
    {
      field: '',
      cellRenderer: EditCellComponent
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
    this.recipeList = [...this.recipeList, $event];
  }

  onEditModalClosed($eventData: any) {
    let tempList = []
    for (let recipe of this.recipeList){
      if ($eventData.id != recipe.id){
        tempList.push(recipe)
      } else {
        tempList.push($eventData)
      }
    }
    // to trigger grid update
    this.recipeList = [...tempList];
  }

  openModal() {
    this.recipeAddComponent.openAddRecipeModal();
  }
}
