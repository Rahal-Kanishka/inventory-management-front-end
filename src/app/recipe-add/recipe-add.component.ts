import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const ADD_RECIPE = '/recipe/add'
@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.css'
})
export class RecipeAddComponent {
  @ViewChild('recipeModel', { static: true }) modalElement!: ElementRef;
  @Output() modalClosed = new EventEmitter<any>();
  recipeForm: FormGroup;
  addedValue = null;
  public recipeData: any = null;
  private myModal!: Modal;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {

    this.recipeForm = new FormGroup({
      name: new FormControl(this.recipeData?.name, [Validators.required]),
      description: new FormControl(this.recipeData?.description, [Validators.required]),
      ingredients: new FormArray([])
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  openAddRecipeModal() {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
  }

  addEmptyIngredientToRecipe() {
    this.ingredients.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(0)]),
    }));
  }

  closeModal() {
    this.recipeForm.reset()
    // Hide the modal
    this.myModal.hide();
    this.recipeData = null;
    this.ingredients.clear();
  }

  clearForm() {
    this.recipeForm.reset();
  }

  AddNewRecipeData() {

    if (!this.recipeForm.invalid) {
      this.backEndService.postRequest(this.recipeForm?.getRawValue(), ADD_RECIPE)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.addedValue = response;
              this.toastrService.success(response?.name + ' is saved', 'Successfully updated')
              // Emit the data
              this.modalClosed.emit(this.addedValue);
              this.clearForm();
              this.closeModal();
            },
            error: (v) => this.toastrService.error(v?.toString(), 'Error occurred in updating data',)
          }
        )
    }

  }

  removeIngredient(index: number) {
    if (index !== -1) {
      this.ingredients.removeAt(index)
    }
  }
}
