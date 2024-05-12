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
import { WidgetLayout, WidgetLayoutService } from './widget-layout.service';

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
              private renderer: Renderer2,
              private widgetLayoutService: WidgetLayoutService) {
    this.initializeGridOptions();
    this.initializeWidgets();
    this.initializeSliderItems();
    this.subscription = this.sliderStateService.enlargedSlider$.subscribe(enlarged => {
      this.enlargedSlider = enlarged;
    });
  }

  ngOnInit(): void {
    this.loadWidgetLayouts(); // Fetch widget layouts when the component initializes
  }

  ngAfterViewInit(): void {
    this.adjustSliderPosition();
  }

  loadWidgetLayouts(): void {
    this.widgetLayoutService.getAll().subscribe(layouts => {
      this.widgets = layouts.map(layout => this.createGridsterItemFromLayout(layout));
    });
  }

  getComponentType(typeName: string): Type<any> {
    // Map type name to component, for example:
    switch (typeName) {
      case 'BMIComponent': return BMIComponent;
      case 'pomodoroComponent': return pomodoroComponent;
      default: return null; // Default or error handling
    }
  }

  createGridsterItemFromLayout(layout: WidgetLayout): GridsterItem {
    return {
      cols: layout.cols,
      rows: layout.rows,
      x: layout.x,
      y: layout.y,
      id: layout.id,
      component: this.getComponentType(layout.componentType)
    };
  }

  saveWidget(widget: GridsterItem): void {
    // First, log the widget and layout to be saved for debugging purposes
    console.log('Attempting to save widget:', widget);
  
    // Convert the widget to a layout object
    const layout = this.convertToWidgetLayout(widget);
    console.log('Converted widget to layout:', layout);
  
    // Check if the widget already has an ID (existing widget)
    if (widget.id) {
      console.log(`Updating existing widget layout with ID: ${widget.id}`);
      this.widgetLayoutService.update(widget.id, layout).subscribe({
        next: () => {
          console.log('Layout updated successfully');
        },
        error: error => {
          console.error('Error updating layout', error);
          if (error.error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else {
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
          }
        },
        complete: () => console.log('Update widget layout request completed.')
      });
    } else { // This is a new widget
      console.log('Creating new widget layout');
      this.widgetLayoutService.create(layout).subscribe({
        next: (savedLayout) => {
          console.log('Pre id:', widget.id);
          widget.id = savedLayout.id; // Update id of newly created widget
          console.log('Widget id:', widget.id);
          console.log('SavedLayoutId:', savedLayout.id);
          console.log('Layout created successfully:', savedLayout);
        },
        error: error => {
          console.error('Error creating layout', error);
          if (error.error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else {
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
          }
          if (error.status === 404) {
            console.error('Endpoint not found. Ensure the URL is correct and the server is reachable.');
          } else if (error.status === 500) {
            console.error('Internal server error. Check server logs for more details.');
          }
        },
        complete: () => console.log('Create widget layout request completed.')
      });
    }
  }
  

  deleteWidget(widget: GridsterItem, index: number): void {
    if (widget.id) {
      this.widgetLayoutService.delete(widget.id).subscribe(() => {
        this.widgets.splice(index, 1); // Remove the widget from the array on successful deletion
      });
    }
  }

  convertToWidgetLayout(widget: GridsterItem): WidgetLayout {
    return {
      id: widget.id,
      cols: widget.cols,
      rows: widget.rows,
      x: widget.x,
      y: widget.y,
      componentType: (widget.component as Type<any>).name
    };
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
      itemChangeCallback: (item, itemComponent) => {
        console.log('Item was changed', item);
        this.saveWidget(item);
      },
      itemResizeCallback: (item, itemComponent) => {
        console.log('Item was resized', item);
        this.saveWidget(item);
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
    if (this.slider.nativeElement) {
      if (this.enlargedSlider) {
        this.renderer.setStyle(this.slider.nativeElement, 'left', '0');
        this.renderer.setStyle(this.slider.nativeElement, 'transition', 'left 0.5s ease');
      } else {
        this.renderer.setStyle(this.slider.nativeElement, 'left', '4.5%');
        this.renderer.setStyle(this.slider.nativeElement, 'transition', 'left 0.5s ease');
      }
    }
  }

  private resetSliderPosition(): void {
    this.renderer.removeAttribute(this.slider.nativeElement, 'style');
  }
}