import { Component } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { Observable, take } from "rxjs";
import { BackEndService } from "../services/back-end.service";
import { ColDef, GridOptions } from "ag-grid-community";
import { Modal } from 'bootstrap';
import { FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

const GET_INGREDIENTS = '/ingredient/all'
const ADD_INGREDIENTS = '/ingredient/add'
@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css'
})
export class IngredientListComponent {

  public ingredientList: any[] = []

  columnDefs: ColDef[] = [
    { field: 'id' },
    { field: 'name' },
    { field: 'description' },
    { field: 'currentQuantity' }
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

  openModal(): void {
    const modalElement = document.getElementById('exampleModal');
    // Ensure the element exists and cast it as an HTMLElement
    if (modalElement) {
      // Create a new Bootstrap Modal instance
      const myModal = new Modal(modalElement);
      myModal.show();  // Opens the modal
    }
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

  public saveIngredientData() {
    this.backEndService.postRequest(this.ingredientForm?.value, ADD_INGREDIENTS)
      .pipe(take(1))
      .subscribe(
        {
          next: (response) => {
            // to trigger array update into the grid
            this.ingredientList = [...this.ingredientList, response];
            this.toastrService.success(response?.name + ' is saved','Successfully added')
          },
          error: (v) => this.toastrService.error(v?.toString(), 'Error occurred in saving data',)}
      )
  }

}
