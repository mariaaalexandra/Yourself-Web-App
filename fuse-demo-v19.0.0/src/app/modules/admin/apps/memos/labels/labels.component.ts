import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Label } from 'app/models/Lable';
import { NotesService } from 'app/modules/admin/apps/notes/notes.service';
import { LabelService } from 'app/services/note-label.service';
import { debounceTime, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector       : 'notes-labels',
    templateUrl    : './labels.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, NgIf, NgFor, FormsModule, AsyncPipe],
})
export class NotesLabelsComponent implements OnInit, OnDestroy
{
    labels$: Observable<Label[]>;
    newLabel: Label = new Label;
    noteLabel: Label[] = [];
    userId:number = Number(localStorage.getItem('userId'));

    labelChanged: Subject<Label> = new Subject<Label>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notesService: NotesService,
        private labelService: LabelService
    )
    {
    }

    allLabels():void {

        this.labelService.getAllNoteLabels(this.userId).subscribe({
            next: (response) => {
              this.noteLabel = response;
              console.log('Labels retrieved successfully', this.noteLabel);
            },
            error: (error) => {
              console.error('There was an error retrieving the labels', error);
            }
          });
        //   window.location.reload();

    }

    addLabels(labelName: string): void {
        if (!labelName.trim()) {
          return; // If the input is empty or only whitespace, do nothing
        }

        const label = labelName.trim() ; // Adjust this object based on what your backend expects
        this.newLabel.title = label;
        this.newLabel.active = true;
        this.newLabel.userId = [this.userId];
        this.labelService.createNoteLabel(this.newLabel).subscribe({
          next: (response) => {
            console.log('Label added successfully', response);
            // You might want to clear the input field here, but it's already being cleared in your template
            // Optionally, update your UI to reflect the added label
          },
          error: (error) => {
            console.error('Error adding label', error);
            // Optionally, handle the error, maybe show a user-friendly message
          }
        });
        window.location.reload();

      }


      removeNoteLabel(id: number) {
        this.labelService.deleteNoteLabel(id).subscribe({
          next: () => console.log('Note label deleted successfully.'),
          error: (error) => console.error('Error deleting note label', error)
        });
        window.location.reload();

      }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.allLabels();

        // Get the labels
        // this.labels$ = this._notesService.labels$;

        // Subscribe to label updates
        // this.labelChanged
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(500),
        //         filter(label => label.title.trim() !== ''),
        //         switchMap(label => this._notesService.updateLabel(label)))
        //     .subscribe(() =>
        //     {
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add label
     *
     * @param title
     */
    addLabel(title: string): void
    {
        this._notesService.addLabel(title).subscribe();
    }

    /**
     * Update label
     */
    updateLabel(label: Label): void
    {
        this.labelChanged.next(label);
    }

    /**
     * Delete label
     *
     * @param id
     */
    deleteLabel(id: string): void
    {
        this._notesService.deleteLabel(id).subscribe(() =>
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
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
