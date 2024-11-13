import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const EDIT_INGREDIENTS = '/ingredient/edit'
@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrl: './ingredient-edit.component.css'
})
export class IngredientEditComponent {

  @ViewChild('exampleModel', { static: true }) modalElement!: ElementRef;
  @Output() modalClosed = new EventEmitter<any>();

  public ingredientData: any = null;
  addedValue = null;
  private myModal!: Modal;
  ingredientForm: FormGroup;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {
    this.ingredientForm = new FormGroup({
      id: new FormControl({ value: this.ingredientData?.id , disabled: true}),
      name: new FormControl(this.ingredientData?.name, [Validators.required]),
      description: new FormControl(this.ingredientData?.description, [Validators.required]),
      currentQuantity: new FormControl(this.ingredientData?.currentQuantity, [Validators.required, Validators.min(0)]),
      image: new FormControl(this.ingredientData?.image)
    });
  }

  openEditModal(modalData: any) {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
    this.ingredientData = modalData
    if(this.ingredientData){
      this.ingredientForm.patchValue(this.ingredientData)
    }
  }

  closeModal() {
    this.ingredientForm.reset()
    // Hide the modal
    this.myModal.hide();
  }

  clearForm() {
    this.ingredientForm.reset();
  }

  public saveIngredientData() {
    if (!this.ingredientForm.invalid) {
      this.backEndService.putRequest(this.ingredientForm?.getRawValue(), EDIT_INGREDIENTS)
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

}
