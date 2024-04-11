import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SliderStateService } from './slider-state.service'; // Update path accordingly
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';

/* Gadgets */
import { ReadingNowTrackerComponent } from './gadgets/ReadingNow Tracker/ReadingNowTracker.component';
/* Gadgets */

@Component({
  selector: 'app-dashboard-1',
  templateUrl: './dashboard-1.component.html',
  styleUrls: ['./dashboard-1.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class Dashboard1Component implements OnDestroy {

  sliderOpen = false;
  enlargedSlider = false;
  private subscription: Subscription;
  @ViewChild('dynamicInsert', { read: ViewContainerRef }) dynamicInsert: ViewContainerRef;

  constructor(
    private sliderStateService: SliderStateService,
    private componentFactoryResolver: ComponentFactoryResolver) {
    // Subscribe to the enlargedSlider$ observable
    this.subscription = this.sliderStateService.enlargedSlider$.subscribe(enlarged => {
      this.enlargedSlider = enlarged;
      // Adjust slider position when enlarging
      if (enlarged) {
        this.adjustSliderPosition();
      } else {
        this.resetSliderPosition();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Unsubscribe from the subscription to prevent memory leaks
    this.subscription.unsubscribe();
  }

  toggleSlider() {
    this.sliderOpen = !this.sliderOpen;
  }

  toggleEnlargedSlider() {
    // Toggle the enlarged state through the service
    this.sliderStateService.toggleEnlargedSlider();
  }

  private adjustSliderPosition() {
    document.querySelector('.slider').setAttribute('style', 'left: 0; right: 0;');
  }

  private resetSliderPosition() {
    document.querySelector('.slider').removeAttribute('style');
  }
}
