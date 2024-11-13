import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { take } from "rxjs";

const EDIT_RECIPE = '/recipe/update/'

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent {

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
      id: new FormControl({ value: this.recipeData?.id, disabled: true }),
      name: new FormControl(this.recipeData?.name, [Validators.required]),
      description: new FormControl(this.recipeData?.description, [Validators.required]),
      ingredients: new FormArray([])
    });
  }

  ngAfterViewInit(): void {
    console.log('this.recipeData; ', this.recipeData)
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(ingredient: any) {
    this.ingredients.push(new FormGroup({
      name: new FormControl(ingredient?.name, [Validators.required]),
      quantity: new FormControl(ingredient?.quantity, [Validators.required, Validators.min(0)]),
    }));
  }

  openEditModal(modalData: any) {
    console.log('modal is opening')
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
    this.recipeData = modalData
    if (this.recipeForm && this.recipeData) {
      this.recipeForm.patchValue(this.recipeData)
      // initiate form array
      for (let ingredient of this.recipeData?.ingredients) {
        this.addIngredient(ingredient);
      }
    }
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

  public editRecipeData() {
    if (!this.recipeForm.invalid) {
      this.backEndService.putRequest(this.recipeForm?.getRawValue(), EDIT_RECIPE + this.recipeForm?.getRawValue().id)
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

  addEmptyIngredientToRecipe() {
    this.ingredients.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(0)]),
    }));
  }


}
