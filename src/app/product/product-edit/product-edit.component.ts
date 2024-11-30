import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const UPDATE_PRODUCT = '/product/update/'
const SEARCH_RECIPE = '/recipe/search_by_name/'

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {
  @Output() modalClosed = new EventEmitter<any>();
  @ViewChild('productEditModel', { static: true }) modalElement!: ElementRef;
  productForm: FormGroup;
  addedValue = null;
  public recipeData: any = null;
  private myModal!: Modal;
  public suggestedRecipeList: any[] = []
  public assignedRecipe: any | null;
  private productData: any | null;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {

    this.productForm = new FormGroup({
      id: new FormControl({disabled: true, value: ''}, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      selling_price: new FormControl('', [Validators.required]),
      batch_size: new FormControl('', [Validators.required]),
      expire_duration: new FormControl('', [Validators.required]),
      Recipe_id: new FormControl('', [Validators.required]),
    });
  }

  get ingredients(): FormArray {
    return this.productForm.get('ingredients') as FormArray;
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

  updateProductData() {
    if (!this.productForm.invalid) {
      this.backEndService.putRequest(this.productForm?.getRawValue(), UPDATE_PRODUCT)
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
    let inputElement: any = document.getElementById('product-name-input')
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
  openEditModal(modalData: any) {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
    this.productData = modalData
    if(this.productData){
      this.productForm.patchValue(this.productData)
      this.assignedRecipe =this.productData.recipe;
    }
  }
}
