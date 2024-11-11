import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Modal } from "bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const ADD_INGREDIENTS = '/ingredient/add'

@Component({
  selector: 'app-ingredient-add',
  templateUrl: './ingredient-add.component.html',
  styleUrl: './ingredient-add.component.css'
})
export class IngredientAddComponent {

  @ViewChild('exampleModel', { static: true }) modalElement!: ElementRef;
  @Output() modalClosed = new EventEmitter<any>();
  addedValue = null;
  private myModal!: Modal;
  ingredientForm: FormGroup;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {
    this.ingredientForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  openModal() {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
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
      this.backEndService.postRequest(this.ingredientForm?.value, ADD_INGREDIENTS)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.addedValue = response;
              this.toastrService.success(response?.name + ' is saved', 'Successfully added')
              // Emit the data
              this.modalClosed.emit(this.addedValue);
              this.clearForm();
              this.closeModal();
            },
            error: (v) => this.toastrService.error(v?.toString(), 'Error occurred in saving data',)
          }
        )
    }
  }
}
