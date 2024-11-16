import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrl: './location-edit.component.css'
})
export class LocationEditComponent {
  @Output() modalClosed = new EventEmitter<any>();

  openEditModal(data: any) {

  }
}
