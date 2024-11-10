import { Component } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { Observable, take } from "rxjs";
import { BackEndService } from "../services/back-end.service";
import { ColDef, GridOptions } from "ag-grid-community";

const GET_INGREDIENTS = '/ingredient/all'
@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css'
})
export class IngredientListComponent {

  public ingredientList = []

  columnDefs: ColDef[] = [
    { field: 'id' },
    { field: 'name' },
    { field: 'quantity' }
  ];
  constructor(private backEndService: BackEndService) {
    this.getIngredientData()
  }

  public gridOptions: GridOptions = {
    rowHeight: 45,
    autoSizeStrategy: {
      type: 'fitGridWidth'
    },
    getRowStyle: params => {
      if (params && params.node.rowIndex && params.node.rowIndex % 2 === 1) {
        return { background: 'gray' };
      } else {
        return { background: 'white' };
      }
    }
  }

  public getIngredientData() {
    this.backEndService.getRequest(GET_INGREDIENTS)
      .pipe(take(1))
      .subscribe(
        {next: (response) => this.ingredientList = response}
    )
  }

}
