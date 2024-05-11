import { Component, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, Type, ComponentRef, ApplicationRef, Injector, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { BMIComponent } from './gadgets/BMI gadget/BMIgadget.component';
import { pomodoroComponent } from './gadgets/Pomodoro/pomodoro.component';
import { SliderStateService } from './slider-state.service';
import { GridsterConfig, GridsterItem, GridsterModule } from 'angular-gridster2';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-1',
  templateUrl: './dashboard-1.component.html',
  styleUrls: ['./dashboard-1.component.scss'],
  standalone: true,
  imports: [CommonModule, GridsterModule, DragDropModule, MatIconModule, MatButtonModule]
})
export class Dashboard1Component implements OnDestroy {
  sliderOpen = false;
  enlargedSlider = true;
  gridOptions: GridsterConfig;
  widgets: Array<GridsterItem>;
  sliderItems: Array<{ image: string, title: string, description: string, component: Type<any> }>;
  private subscription: Subscription;
  @ViewChild('dynamicInsert', { read: ViewContainerRef }) dynamicInsert: ViewContainerRef;
  @ViewChild('slider', { static: true }) slider: ElementRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private sliderStateService: SliderStateService,
              private appRef: ApplicationRef,
              private injector: Injector,
              private renderer: Renderer2) {
    this.initializeGridOptions();
    this.initializeWidgets();
    this.initializeSliderItems();
    this.subscription = this.sliderStateService.enlargedSlider$.subscribe(enlarged => {
      this.enlargedSlider = enlarged;
      this.adjustSliderPosition();
    });
  }

  initializeGridOptions(): void {
    this.gridOptions = {
      draggable: {
        enabled: true, // Allows dragging of grid items
        delayStart: 0, // Delay in milliseconds to start the drag
        ignoreContentClass: 'no-drag', // Ignore drag action when clicking on elements with this class
        ignoreContent: false, // Set to true to only drag on handle
        dragHandleClass: 'drag-handler' // CSS class applied to drag handles
      },
      resizable: {
        enabled: true, // Allows resizing of grid items
        handles: {
          s: true, // Enable resizing from the south edge
          e: true, // Enable resizing from the east edge
          se: true, // Enable resizing from the southeast corner
          n: false, // North resize disabled
          w: false, // West resize disabled
          nw: false, // Northwest resize disabled
          ne: false, // Northeast resize disabled
          sw: false // Southwest resize disabled
        },
        delayStart: 0, // Delay in milliseconds to start the resize
      },
      pushItems: true, // Pushes other items away on move or resize
      swap: false, // Swap instead of push
      minCols: 10,
      maxCols: 100,
      minRows: 10,
      //maxRows: 100
      fixedColWidth: 105, // Fixed width of columns in pixels
      fixedRowHeight: 105, // Fixed height of rows in pixels
      keepFixedHeightInMobile: true, // Keeps the height fixed on mobile devices
      keepFixedWidthInMobile: true, // Keeps the width fixed on mobile devices
      scrollSensitivity: 10, // Pixels to scroll when dragging near edge
      scrollSpeed: 20, // Speed of scrolling
      enableEmptyCellClick: false, // Enables clicking on empty cells
      enableEmptyCellDrag: false, // Enables dragging to create new items in empty cells
      enableEmptyCellDrop: true, // Allows dropping items in empty cells
      emptyCellDragMaxCols: 50, // Max cols for a dragged empty cell
      // emptyCellDragMaxRows: 50, // Max rows for a dragged empty cell
      compactType: 'none' // Compact items to the top and left ('none', 'compactUp', 'compactLeft', 'compactUp&Left')
    };
  }

  initializeWidgets(): void {
    this.widgets = [];
  }

  initializeSliderItems(): void {
    this.sliderItems = [
      { image: '../../../../../assets/img/Gadgets/BMIGadget.png', title: 'BMI Gadget', description: 'Calculate your BMI in seconds', component: BMIComponent },
      { image: '../../../../../assets/img/Gadgets/PomodoroGadget.png', title: 'Pomodoro Gadget', description: 'Pomodoro for productivity', component: pomodoroComponent },
      { image: '../../../../../assets/img/Gadgets/MapGadget.png', title: 'Map Gadget', description: 'Plan your trips', component: pomodoroComponent },
      { image: '../../../../../assets/img/Gadgets/InvestmentGadget.png', title: 'Investment Gadget', description: 'Reach financial freedom', component: pomodoroComponent },
      { image: '../../../../../assets/img/Gadgets/BookReader.png', title: 'Book Reader Gadget', description: 'Cultivate yourself daily', component: pomodoroComponent },
      // Define other components as needed
    ];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.widgets.forEach(widget => {
      const widgetRef = widget.componentRef;
      if (widgetRef) {
        widgetRef.destroy();
      }
    });
  }

  toggleSlider(): void {
    this.sliderOpen = !this.sliderOpen;
    this.adjustSliderPosition();
  }

  activeComponents: Set<Type<any>> = new Set();

  addWidget(component: Type<any>): void {
    if (this.widgets.some(widget => widget.component === component)) {
      // If the component is already added to the Gridster, do nothing
      return;
    }
    
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    
    // Create the component reference without attaching it to the view
    const componentRef = componentFactory.create(this.injector);
  
    // Adjust the number of rows and columns to fit the content
    const newWidget: GridsterItem = {
      cols: 5,
      rows: 6, // Adjust this value based on the height of your component's body
      y: 0,
      x: 0,
      component: component,
      dragEnabled: true, // Ensure dragging is enabled
      resizeEnabled: true, // Ensure resizing is enabled
      componentRef: componentRef
    };
    
    this.widgets.push(newWidget);
    this.appRef.tick(); // Ensure global change detection is aware of the new component
}

  removeWidget(index: number): void {
    const widget = this.widgets[index];
    if (widget && widget.componentRef) {
      this.activeComponents.delete(widget.component.type);
      widget.componentRef.destroy();
      this.widgets.splice(index, 1);
    }
  }

  private adjustSliderPosition(): void {
    if (this.enlargedSlider) {
      // Reset position to the normal state
      this.renderer.setStyle(this.slider.nativeElement, 'left', '0');
      this.renderer.setStyle(this.slider.nativeElement, 'transition', 'left 0.5s ease');
    } else {
      // Move slider to the right by 10% of the container width
      this.renderer.setStyle(this.slider.nativeElement, 'left', '4.5%');
      this.renderer.setStyle(this.slider.nativeElement, 'transition', 'left 0.5s ease');
    }
  }

  private resetSliderPosition(): void {
    this.renderer.removeAttribute(this.slider.nativeElement, 'style');
  }
}