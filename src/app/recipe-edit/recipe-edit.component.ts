import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent {
  @Output() modalClosed = new EventEmitter<any>();

}
