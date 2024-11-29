import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const ADD_PRODUCT = '/product/add'
const SEARCH_RECIPE = '/recipe/search_by_name/'

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  @Output() modalClosed = new EventEmitter<any>();
  @ViewChild('productAddModel', { static: true }) modalElement!: ElementRef;
  productForm: FormGroup;
  addedValue = null;
  public recipeData: any = null;
  private myModal!: Modal;
  public suggestedRecipeList: any[] = []
  public assignedRecipe: any | null;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {

    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      selling_price: new FormControl('', [Validators.required]),
      Recipe_id: new FormControl('', [Validators.required]),
    });
  }

  get ingredients(): FormArray {
    return this.productForm.get('ingredients') as FormArray;
  }

  openAddProductModal() {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
  }

  closeModal() {
    this.productForm.reset()
    // Hide the modal
    this.myModal.hide();
    this.recipeData = null;
  }

  clearForm() {
    this.productForm.reset();
  }

  AddNewProductData() {
    if (!this.productForm.invalid) {
      this.backEndService.postRequest(this.productForm?.getRawValue(), ADD_PRODUCT)
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

  public findRecipesByName() {
    let inputElement: any = document.getElementById('name-input')
    console.log('button: ', inputElement?.value)
    if (inputElement && inputElement?.value) {
      this.backEndService.getRequest(SEARCH_RECIPE + inputElement.value)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              this.suggestedRecipeList = response
            },
            error: (v) => this.toastrService.error(v?.toString(), 'Error occurred in retrieving recipe data')
          }
        )
    } else {
      this.suggestedRecipeList = []
    }
  }

  assignRecipe(recipeId: any) {
    this.productForm.get('Recipe_id')?.setValue(recipeId);
    // show assigned recipe
    const result = this.suggestedRecipeList.filter(item => item.id == recipeId)
    if (result && result.length > 0) {
      this.assignedRecipe = result[0]
    }
  }
}
