import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  submissionDate = new Date('December 11, 2024');
  currentDate = Date.now();
  day = 24*60*60*1000
  result = Math.round((this.submissionDate.getTime() - this.currentDate)/(this.day))
  title = 'inventory-management';
}
