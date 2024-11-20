import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  @Output() onUserEditedUsingModal = new EventEmitter<any>();

  openEditModal(data: any) {

  }
}
