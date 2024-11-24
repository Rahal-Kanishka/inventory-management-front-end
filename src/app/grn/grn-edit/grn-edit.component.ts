import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const UPDATE_GRN = '/grn/update/'
@Component({
  selector: 'app-grn-edit',
  templateUrl: './grn-edit.component.html',
  styleUrl: './grn-edit.component.css'
})
export class GrnEditComponent {
  @Output() onGrnEdit = new EventEmitter<any>();

  @ViewChild('updateGRNModel', { static: true }) modalElement!: ElementRef;
  grnForm: FormGroup;
  addedValue = null;
  public recipeData: any = null;
  private myModal!: Modal;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {

    this.grnForm = new FormGroup({
      id: new FormControl({disabled: true, value: ''},[]),
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

  UpdateGRNData() {

    if (!this.grnForm.invalid) {
      this.backEndService.putRequest(this.grnForm?.getRawValue(), UPDATE_GRN + this.grnForm.getRawValue()?.id)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.addedValue = response;
              this.toastrService.success('GRN ID:' + response?.id + ' is saved', 'Successfully updated')
              // Emit the data
              this.onGrnEdit.emit(this.addedValue);
              this.clearForm();
              this.closeModal();
            },
            error: (v) => this.toastrService.error(v?.error?.detail, 'Error occurred in updating data',)
          }
        )
    }
  }

  addIngredient(ingredient: any) {
    this.ingredients.push(new FormGroup({
      name: new FormControl(ingredient?.name, [Validators.required]),
      quantity: new FormControl(ingredient?.quantity, [Validators.required, Validators.min(0)]),
    }));
  }

  removeIngredient(index: number) {
    if (index !== -1) {
      this.ingredients.removeAt(index)
    }
  }
  openGRNEditModal(data: any) {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
    this.grnForm.patchValue(data)
    // initiate form array
    for (let ingredient of data?.ingredients) {
      this.addIngredient(ingredient);
    }
  }
}
