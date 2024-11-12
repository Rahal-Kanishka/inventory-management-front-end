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


  context: any;
  recipeList: any[] = [];
  masterColumnDefs: ColDef[] = []
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', cellRenderer: 'agGroupCellRenderer' },
    { field: 'name' },
    { field: 'description' },
    {
      field: '',
      cellRenderer: ViewAndEditCellComponent
    }
  ];

  gridOptionsLevel2 = {}

  gridOptionsLevel1 = {
    masterDetail: true,
    detailCellRendererParams: {
      detailGridOptions: this.gridOptionsLevel2,
      getDetailRowData: function (params: any) {
        params.successCallback(params.data?.ingredients);
      }
    }
  }

  gridOptions: GridOptions = {
    rowHeight: 45,
    autoSizeStrategy: {
      type: 'fitGridWidth'
    },
    masterDetail: true,
    detailCellRendererParams: {
      "detailGridOptions": {
        "columnDefs": this.columnDefs,
      },
      "suppressCallback": true,
    }
  }


  @ViewChild(RecipeAddComponent)
  recipeAddComponent!
    :
    RecipeAddComponent;
  @ViewChild(RecipeEditComponent)
  recipeEditComponent!
    :
    RecipeEditComponent;

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

  onAddModalClosed($event
                     :
                     any
  ) {

  }

  onEditModalClosed($event
                      :
                      any
  ) {

  }

  openModal() {

  }
}
