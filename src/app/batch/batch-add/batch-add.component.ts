import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const ADD_BATCH = '/batch/add/'
const SEARCH_PRODUCT = '/product/search_by_name/'
@Component({
  selector: 'app-batch-add',
  templateUrl: './batch-add.component.html',
  styleUrl: './batch-add.component.css'
})
export class BatchAddComponent {
  @Output() modalClosed = new EventEmitter<any>();

  @ViewChild('batchAddModel', { static: true }) modalElement!: ElementRef;
  batchForm: FormGroup;
  addedValue = null;
  public recipeData: any = null;
  private myModal!: Modal;
  public suggestedProductList: any[] = []
  public assignedProduct: any | null;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {

    this.batchForm = new FormGroup({
      batch_count: new FormControl('', [Validators.required]),
      product_id: new FormControl('', [Validators.required]),
    });
  }

  get ingredients(): FormArray {
    return this.batchForm.get('ingredients') as FormArray;
  }

  closeModal() {
    this.batchForm.reset()
    // Hide the modal
    this.myModal.hide();
    this.recipeData = null;
  }

  clearForm() {
    this.batchForm.reset();
  }

  addNewBatch() {
    if (!this.batchForm.invalid) {
      this.backEndService.postRequest(this.batchForm?.getRawValue(), ADD_BATCH)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.addedValue = response;
              this.toastrService.success(response?.name + ' is saved', 'Successfully Added')
              // Emit the data
              this.modalClosed.emit(this.addedValue);
              this.clearForm();
              this.closeModal();
            },
            error: (v) => {
              if (v && v.error.detail)
                this.toastrService.error(v?.error.detail, 'Error occurred in saving data')
            }
          }
        )
    }

  }

  public findProductsByName() {
    let inputElement: any = document.getElementById('name-input')
    console.log('button: ', inputElement?.value)
    if (inputElement && inputElement?.value) {
      this.backEndService.getRequest(SEARCH_PRODUCT + inputElement.value)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              this.suggestedProductList = response
            },
            error: (v) => this.toastrService.error(v?.toString(), 'Error occurred in retrieving product data')
          }
        )
    } else {
      this.suggestedProductList = []
    }
  }

  assignRecipe(productId: any) {
    this.batchForm.get('product_id')?.setValue(productId);
    // show assigned recipe
    const result = this.suggestedProductList.filter(item => item.id == productId)
    if (result && result.length > 0) {
      this.assignedProduct = result[0]
    }
  }
  openAddBatchModal() {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
  }
}
