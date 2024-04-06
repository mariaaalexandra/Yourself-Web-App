import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-1',
  templateUrl: './dashboard-1.component.html',
  styleUrls: ['./dashboard-1.component.scss'],
  imports: [CommonModule], // Import CommonModule for using ngClass, etc.
  standalone: true // Mark the component as standalone
})
export class Dashboard1Component {
  sliderOpen = false; // Controls the state of the slider

  toggleSlider() {
    this.sliderOpen = !this.sliderOpen; // Toggles the slider's visibility
  }
}
