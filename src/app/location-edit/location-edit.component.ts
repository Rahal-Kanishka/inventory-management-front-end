import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const ASSIGN_USERS = '/user/'
const UPDATE_LOCATION = '/location/update/'

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrl: './location-edit.component.css'
})
export class LocationEditComponent {
  @Output() modalClosed = new EventEmitter<any>();
  @ViewChild('locationEditModel', { static: true }) modalElement!: ElementRef;
  locationForm: FormGroup;
  addedValue = null;
  public locationData: any = null;
  private myModal!: Modal;
  public assignedUsersList: any[] = []

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {
    this.locationForm = new FormGroup({
      id: new FormControl({value: this.locationData?.id, disabled: true}, [Validators.required]),
      name: new FormControl(this.locationData?.name, [Validators.required]),
      address: new FormControl(this.locationData?.address, [Validators.required])
    });
  }

  openEditModal(dataFromParentComponent: any) {
    if(dataFromParentComponent){
      this.locationForm.patchValue(dataFromParentComponent)
      this.locationData = dataFromParentComponent;
      this.getAssignUsers();
    }
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
  }

  closeModal() {
    this.locationForm.reset()
    // Hide the modal
    this.myModal.hide();

  }

  updateLocationData() {
    if (!this.locationForm.invalid) {
      this.backEndService.putRequest(this.locationForm?.getRawValue(), UPDATE_LOCATION + this.locationForm.getRawValue()?.id)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.addedValue = response;
              this.toastrService.success(response?.name + ' is saved', 'Successfully added')
              // Emit the data
              this.modalClosed.emit(this.addedValue);
              this.closeModal();
            },
            error: (v) => this.toastrService.error(v?.toString(), 'Error occurred in saving data',)
          }
        )
    }
  }

  private getAssignUsers(){
    this.backEndService.getRequest( ASSIGN_USERS + this.locationData?.id)
      .pipe(take(1))
      .subscribe(
        {
          next: (response) => {
            // to trigger array update into the grid
            this.assignedUsersList = response;
          },
          error: (v) => this.toastrService.error(v?.toString(), 'Error occurred in retrieving users data',)
        }
      )
  }

  assignUsersToLocation() {

  }

  removeAssignedUser(userID: any) {

  }
}
