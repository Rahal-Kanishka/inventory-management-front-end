import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "bootstrap";
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
const GET_USER_TYPES = '/user/type/all'
const UPDATE_USER = '/user/update/'
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  @Output() onUserEditedUsingModal = new EventEmitter<any>();

  public userFormGroup: FormGroup;
  @ViewChild('userEditModel', { static: true }) modalElement!: ElementRef;
  private myModal!: Modal;
  public userTypes: any[] = []
  private userData: any;

  constructor(
    private backEndService: BackEndService,
    private toastrService: ToastrService) {
    this.getUserTypes();
    this.userFormGroup = new FormGroup({
      id: new FormControl({ disabled: true, value: '' }, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [Validators.required]),
      email: new FormControl({ disabled: true, value: '' }, [Validators.required]),
      UserType_id: new FormControl(0, [Validators.required, Validators.min(1)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  getUserTypes() {
    let tmp: any = { id: 0, name: 'Select User Type' }
    this.backEndService.getRequest(GET_USER_TYPES)
      .pipe(take(1))
      .subscribe(
        {
          next: (response: any) => {
            this.userTypes = response
            this.userTypes = [...this.userTypes, tmp]
          }
        }
      )
  }

  openEditModal(data: any) {
    this.myModal = new Modal(this.modalElement.nativeElement);
    this.myModal.show();
    this.userFormGroup.patchValue(data);
    // this.userFormGroup.get('password')?.patchValue('')
    this.userFormGroup.get('confirmPassword')?.patchValue( this.userFormGroup.get('password')?.value)
  }

  closeModal() {
    this.userFormGroup.reset()
    // Hide the modal
    this.myModal.hide();
  }

  clearForm() {
    this.userFormGroup.reset();
  }

  updateUser() {
    console.log(this.userFormGroup.getRawValue())
    let formDataObject = this.userFormGroup?.getRawValue()
    delete formDataObject.confirmPassword;
    if (!this.userFormGroup.invalid) {
      this.backEndService.putRequest(formDataObject, UPDATE_USER)
        .pipe(take(1))
        .subscribe(
          {
            next: (response) => {
              // to trigger array update into the grid
              this.toastrService.success(response?.name + ' is saved', 'Successfully added')
              // Emit the data
              this.onUserEditedUsingModal.emit(response);
              this.clearForm();
              this.closeModal();
            },
            error: (v) => this.toastrService.error(v?.error?.detail, 'Error occurred in saving data',)
          }
        )
    }
  }
}
