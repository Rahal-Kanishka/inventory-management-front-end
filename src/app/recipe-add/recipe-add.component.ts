import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.css'
})
export class RecipeAddComponent {
  @Output() modalClosed = new EventEmitter<any>();

}
