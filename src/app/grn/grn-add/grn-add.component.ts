import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const ADD_GRN = '/grn/add/'
@Component({
  selector: 'app-grn-add',
  templateUrl: './grn-add.component.html',
  styleUrl: './grn-add.component.css'
})
export class GrnAddComponent {
  @Output() onGRNAddEvent = new EventEmitter<any>();

  @ViewChild('addGRNModel', { static: true }) modalElement!: ElementRef;
  grnForm: FormGroup;
  addedValue = null;
  public recipeData: any = null;
  private myModal!: Modal;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {

    this.grnForm = new FormGroup({
      ingredients: new FormArray([])
    });
  }

  get ingredients(): FormArray {
    return this.grnForm.get('ingredients') as FormArray;
  }

  addEmptyIngredientToRecipe() {
    this.ingredients.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(0)]),
    }));
  }

  closeModal() {
    this.grnForm.reset()
    // Hide the modal
    this.myModal.hide();
    this.recipeData = null;
    this.ingredients.clear();
  }

  clearForm() {
    this.grnForm.reset();
  }

  AddNewRecipeData() {

    if (!this.grnForm.invalid) {
      this.backEndService.postRequest(this.grnForm?.getRawValue(), ADD_GRN)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.addedValue = response;
              this.toastrService.success('GRN ID:' + response?.id + ' is saved', 'Successfully Added')
              // Emit the data
              this.onGRNAddEvent.emit(this.addedValue);
              this.clearForm();
              this.closeModal();
            },
            error: (v) => this.toastrService.error(v?.error?.detail, 'Error occurred in Saving data',)
          }
        )
    }

  }

  removeIngredient(index: number) {
    if (index !== -1) {
      this.ingredients.removeAt(index)
    }
  }
  openGRNAddModal() {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
  }
}
