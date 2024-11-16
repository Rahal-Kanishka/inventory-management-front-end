import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const ADD_LOCATION = '/location/add'

@Component({
  selector: 'app-location-add',
  templateUrl: './location-add.component.html',
  styleUrl: './location-add.component.css'
})
export class LocationAddComponent {

  @ViewChild('exampleModel', { static: true }) modalElement!: ElementRef;
  @Output() modalClosed = new EventEmitter<any>();
  addedValue = null;
  public locationForm: FormGroup;
  private myModal!: Modal;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {
    this.locationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    });
  }

  openModal() {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
  }

  closeModal() {
    this.locationForm.reset()
    // Hide the modal
    this.myModal.hide();
  }

  clearForm() {
    this.locationForm.reset();
  }

  public saveLocationData() {
    if (!this.locationForm.invalid) {
      this.backEndService.postRequest(this.locationForm?.value, ADD_LOCATION)
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
