import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { take } from "rxjs";

const GET_USER_TYPES = '/user/type/all'
const CREATE_USER = '/user/create/'
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  @Output() onUserAddedFromModal = new EventEmitter<any>();
  public userFormGroup: FormGroup;
  @ViewChild('userAddModel', { static: true }) modalElement!: ElementRef;
  private myModal!: Modal;
  public userTypes: any[] = []

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {
    this.getUserTypes();
    this.userFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      UserType_id: new FormControl(0, [Validators.required, Validators.min(1)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  getUserTypes() {
    let tmp: any = { id: 0, name: 'Select User Type'}
    this.backEndService.getRequest(GET_USER_TYPES)
      .pipe(take(1))
      .subscribe(
        { next: (response: any) => {
            this.userTypes = response
            this.userTypes  = [...this.userTypes, tmp]
          } }
      )
  }

  openModal() {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
  }

  closeModal() {
    this.userFormGroup.reset()
    // Hide the modal
    this.myModal.hide();
  }

  clearForm() {
    this.userFormGroup.reset();
  }

  addUser() {
    console.log(this.userFormGroup.getRawValue())
    if (!this.userFormGroup.invalid) {
      this.backEndService.postRequest(this.userFormGroup?.value, CREATE_USER)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.toastrService.success(response?.name + ' is saved', 'Successfully added')
              // Emit the data
              this.onUserAddedFromModal.emit(response);
              this.clearForm();
              this.closeModal();
            },
            error: (v) => this.toastrService.error(v?.error?.detail, 'Error occurred in saving data',)
          }
        )
    }
  }

  changeTye($event: Event) {

  }
}
