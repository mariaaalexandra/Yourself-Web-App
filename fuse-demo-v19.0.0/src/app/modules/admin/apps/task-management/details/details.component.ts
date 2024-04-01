import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Tag } from 'app/models/Tag';
import { Task } from 'app/models/Task';
import { TasksListComponent } from 'app/modules/admin/apps/task-management/list/list.component';
import { TasksService } from 'app/modules/admin/apps/task-management/tasks.service';

import { TagService } from 'app/services/tag-service';
import { TaskManagementService } from 'app/services/task-servrice';
import { assign } from 'lodash-es';
import { DateTime } from 'luxon';
import { debounceTime, filter, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector       : 'tasks-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [FormsModule, ReactiveFormsModule, MatButtonModule, NgIf, MatIconModule, MatMenuModule, RouterLink, MatDividerModule, MatFormFieldModule, MatInputModule, TextFieldModule, NgFor, MatRippleModule, MatCheckboxModule, NgClass, MatDatepickerModule, FuseFindByKeyPipe, DatePipe],
})
export class TasksDetailsComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('titleField') private _titleField: ElementRef;

    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    task: Task;
    taskForm: UntypedFormGroup;
    tasks: Task[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _tasksListComponent: TasksListComponent,
        private _tasksService: TasksService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private taskManagement: TaskManagementService,
        private tagService: TagService
    )
    {
    }

    getTags(userId: number): void {
        this.tagService.getTagsByUserId(userId).subscribe({
          next: (tags) => {
            this.tags = tags;
            this.filteredTags = tags;
            // Assign the fetched tags to the component's tag array
            // Additional logic to handle the received tags
            this._changeDetectorRef.markForCheck();
            console.log("tags " + JSON.stringify(this.tags))
          },
          error: (error) => {
            console.error('Error fetching tags:', error);
            // Handle any errors that occur during the fetch operation
          }
        });
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        const taskId = Number(localStorage.getItem('taskId'));

        const userId = Number(localStorage.getItem('userId'))

        this.getTags(userId);

        // Open the drawer
        this._tasksListComponent.matDrawer.open();

        // Create the task form
        this.taskForm = this._formBuilder.group({
            id       : [''],
            type     : [''],
            title    : [''],
            notes    : [''],
            completed: [false],
            dueDate  : [null],
            priority : [0],
            tags     : [],
            order    : [0],
        });


        if (!isNaN(taskId)) {
          this.taskManagement.findById(taskId).subscribe({
            next: (task) => {
              this.task = task;
              console.log("view " + JSON.stringify(task))
              this.taskForm.setValue({
                id: this.task.id,
                type: this.task.type,
                title: this.task.title,
                notes: this.task.notes,
                completed: this.task.completed,
                dueDate: this.task.dueDate,
                priority: this.task.priority,
                tags: this.task.tags,
                order: this.task.order
              })
            },
            error: (error) => {
              console.error('Error fetching task:', error);
              // Handle error (e.g., task not found or network error)
            }
          });
        } else {
          console.error('Invalid Task ID');
          // Handle case where task ID is not valid or not found in local storage
        }


        // Get the tags
        // this._tasksService.tags$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((tags: Tag[]) =>
        //     {
        //         this.tags = tags;
        //         this.filteredTags = tags;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

            //get task
            // const taskId = localStorage.getItem("taskId"); // Make sure "taskId" is stored in localStorage

            if (taskId) {
              this.taskManagement.findById(Number(taskId)).subscribe({
                next: (data) => {
                  this.task = data; // Assign the data to 'task' once the data is received
                },
                error: (error) => {
                  console.error('Error fetching task:', error);
                  // Handle any errors, e.g., by showing an error message to the user
                }
              });
            } else {
              console.error('No task ID found in localStorage');
              // Handle the case where no task ID is found, e.g., by redirecting the user or showing a message
            }

            // Get the tasks
        // this._tasksService.tasks$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((tasks: Task[]) =>
        //     {
        //         this.tasks = tasks;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Get the task
        // this._tasksService.task$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((task: Task) =>
        //     {
        //         // Open the drawer in case it is closed
        //         this._tasksListComponent.matDrawer.open();

        //         // Get the task
        //         this.task = task;

        //         // Patch values to the form from the task
        //         this.taskForm.patchValue(task, {emitEvent: false});

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });


        // Update task when there is a value change on the task form

this.taskForm.valueChanges.pipe(
    tap((value) => {
      // Update the task object
      Object.assign(this.task, value);
    }),
    debounceTime(300),
    takeUntil(this._unsubscribeAll),
  ).subscribe((value) => {
        this.task.id = Number(localStorage.getItem("taskId"));
    // Check if the task has an ID
    if (this.task) {
        const taskId = localStorage.getItem("taskId");
        console.log("task" + JSON.stringify(this.task))
      // Update the task on the server
      this.taskManagement.updateTask(Number(taskId), this.task).subscribe({
        next: (updatedTask) => {
          // Optionally, update your local task object with the response if needed
          this.task = updatedTask;
          this.taskForm.patchValue(this.task, {emitEvent: false});


          // Mark for check
          this._changeDetectorRef.markForCheck();
        },
        error: (error) => {
          // Handle error, e.g., log or show a user-friendly message
          console.error('Error updating task:', error);
        }
      });
    } else {
      // Handle the case where there's no task ID (might indicate a new task or an error)
      console.warn('Attempted to update a task without an ID.');
    }
  });

        // Listen for NavigationEnd event to focus on the title field
        this._router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() =>
            {
                // Focus on the title field
                this._titleField.nativeElement.focus();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        this.task.id = Number(localStorage.getItem("taskId"));

        // Listen for matDrawer opened change
        this._tasksListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened),
            )
            .subscribe(() =>
            {
                // Focus on the title element
                this._titleField.nativeElement.focus();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._tasksListComponent.matDrawer.close();
    }

    /**
     * Toggle the completed status
     */
    toggleCompleted(): void
    {
        // Get the form control for 'completed'
        const completedFormControl = this.taskForm.get('completed');

        // Toggle the completed status
        completedFormControl.setValue(!completedFormControl.value);
    }

    /**
     * Open tags panel
     */
    openTagsPanel(): void
    {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX : 'start',
                        originY : 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                ]),
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() =>
        {
            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() =>
        {
            // If overlay exists and attached...
            if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
            {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.task.tags.find(id => id === tag.id);

        // If the found tag is already applied to the task...
        if ( isTagApplied )
        {
            // Remove the tag from the task
            this.deleteTagFromTask(tag);
        }
        else
        {
            // Otherwise add the tag to the task
            this.addTagToTask(tag);
        }
    }

    createNewTag(newTag: Tag): void {
        console.log("new tag " + JSON.stringify(newTag))
        this.tagService.createTag(newTag).subscribe({
          next: (tag) => {
            console.log('Tag created successfully', tag);
            // Handle successful creation, e.g., by clearing the form or displaying a success message
          },
          error: (error) => {
            console.error('Error creating tag:', error);
            // Handle creation error, e.g., by displaying an error message
          },
        });
      }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title: title,
            userId:[Number(localStorage.getItem('userId'))]

        };

        // Create tag on the server
        this._tasksService.createTag(tag)
            .subscribe((response) =>
            {
                // Add the tag to the task
                this.addTagToTask(response);
            });
        this.createNewTag(tag)

    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Tag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._tasksService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Tag): void
    {
        // Delete the tag from the server
        this._tasksService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the task
     *
     * @param tag
     */
    addTagToTask(tag: Tag): void
    {
        // Add the tag
        this.task.tags.unshift(tag.title);

        // Update the task form
        this.taskForm.get('tags').patchValue(this.task.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete tag from the task
     *
     * @param tag
     */
    deleteTagFromTask(tag: Tag): void
    {
        // Remove the tag
        this.task.tags.splice(this.task.tags.findIndex(item => item === tag.id), 1);

        // Update the task form
        this.taskForm.get('tags').patchValue(this.task.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle task tag
     *
     * @param tag
     */
    toggleTaskTag(tag: Tag): void
    {
        if ( this.task.tags.includes(tag.title) )
        {
            this.deleteTagFromTask(tag);
        }
        else
        {
            this.addTagToTask(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Set the task priority
     *
     * @param priority
     */
    setTaskPriority(priority): void
    {
        // Set the value
        this.taskForm.get('priority').setValue(priority);
    }

    /**
     * Check if the task is overdue or not
     */
    isOverdue(): boolean
    {
        return DateTime.fromISO(this.task.dueDate).startOf('day') < DateTime.now().startOf('day');
    }

    deleteForTask(id: number): void {
        this.taskManagement.deleteById(id).subscribe({
          next: () => {
            console.log('Task deleted successfully');
            // Handle successful deletion, e.g., by updating the UI or showing a success message
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            // Handle deletion error, e.g., by displaying an error message
          },
        });
      }

    /**
     * Delete the task
     */
    deleteTask(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete task',
            message: 'Are you sure you want to delete this task? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) =>
        {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Get the current task's id
                const id = this.task.id;

                // // Get the next/previous task's id
                // const currentTaskIndex = this.tasks.findIndex(item => item.id === id);
                // const nextTaskIndex = currentTaskIndex + ((currentTaskIndex === (this.tasks.length - 1)) ? -1 : 1);
                // const nextTaskId = (this.tasks.length === 1 && this.tasks[0].id === id) ? null : this.tasks[nextTaskIndex].id;

                // Delete the task
                this._tasksService.deleteTask(String(id))
                    .subscribe((isDeleted) =>
                    {
                        // Return if the task wasn't deleted...
                        if ( !isDeleted )
                        {
                            return;
                        }
                        this.deleteForTask(id)
                        // Navigate to the next task if available
                        // if ( nextTaskId )
                        // {
                        //     this._router.navigate(['../', nextTaskId], {relativeTo: this._activatedRoute});
                        // }
                        // // Otherwise, navigate to the parent
                        // else
                        // {
                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                        // }
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
