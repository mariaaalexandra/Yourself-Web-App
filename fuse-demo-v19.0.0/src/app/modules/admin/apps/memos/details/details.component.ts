import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { user } from 'app/mock-api/common/user/data';
import { Label } from 'app/models/Lable';
import { Note } from 'app/models/Note';
import { NotesService } from 'app/modules/admin/apps/notes/notes.service';
import { Task } from 'app/modules/admin/apps/notes/notes.types';
import { LabelService } from 'app/services/note-label.service';
import { NoteService } from 'app/services/note.service';
import { debounceTime, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector       : 'notes-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgIf, MatButtonModule, MatIconModule, FormsModule, TextFieldModule, NgFor, MatCheckboxModule, NgClass, MatRippleModule, MatMenuModule, MatDialogModule, AsyncPipe],
})
export class NotesDetailsComponent implements OnInit, OnDestroy, AfterViewInit
{
    note$: Observable<Note>;
    // labels$: Observable<Label[]>;
    allNotes: Note[] = [];
    userId:number = Number(localStorage.getItem('userId'));
    noteLabel: Label[] = [];



    noteChanged: Subject<Note> = new Subject<Note>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public _data: { note: Note },
        private _notesService: NotesService,
        private _matDialogRef: MatDialogRef<NotesDetailsComponent>,
        private noteService: NoteService,
        private labelService: LabelService,

    )
    {
    }

    removeNote(note:Note) {
        console.log("del " + JSON.stringify(note) + " " + note.id)
        this.noteService.deleteNote(note).subscribe({
          next: () => {
            console.log('Note deleted successfully.');
            window.location.reload();

            // Optional: Refresh data or update the UI here

          },
          error: (error) => {
            console.error('Error deleting note', error);
          }
        });
      }

      ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }


    allLabels():void {

        this.labelService.getAllNoteLabels(this.userId).subscribe({
            next: (response) => {
              this.noteLabel = response;
              console.log('Labels retrieved successfully', this.noteLabel);
              this._changeDetectorRef.detectChanges(); // Ensure the view is updated

            },
            error: (error) => {
              console.error('There was an error retrieving the labels', error);
            }
          });
    }


    addNote(note: Note) {
        this.noteService.createNote(note).subscribe({
          next: (createdNote) => {
            localStorage.setItem("noteId", String(createdNote.id));
            console.log('Note created:', createdNote);
            window.location.reload();

            // Handle the response, e.g., update the UI to show the added note
          },
          error: (error) => {
            console.error('There was an error creating the note:', error);
            // Handle any errors, e.g., show an error message to the user
          }
        });
      }

      updateNoteSubtasks(note:Note) {
        const noteId = Number(localStorage.getItem('noteId'));
        note.id=noteId

        this.noteService.updateNoteSubtasks(noteId, note).subscribe({
          next: (updatedNote) => {
            console.log('Note updated successfully', updatedNote);
            this._changeDetectorRef.detectChanges(); // Ensure the view is updated

          },
          error: (error) => {
            console.error('Error updating note', error);
          }
        });
      }

      updateNoteLabels(note:Note) {
        const noteId = Number(localStorage.getItem('noteId'));

        this.noteService.updateNoteLabels(noteId, note).subscribe({
          next: (updatedNote) => {
            console.log('Labels updated successfully', updatedNote);
            this._changeDetectorRef.detectChanges(); // Ensure the view is updated

          },
          error: (error) => {
            console.error('Error updating labels', error);
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
        console.log(JSON.stringify(this._data.note)+ "nnn")
        this.allLabels();
        // Edit
        if ( this._data.note.id )
        {
            // Request the data from the server
            // this._notesService.getNoteById(this._data.note.id).subscribe();

            // // // Get the note
            this.note$ = of(this._data.note);
        }
        // Add
        else
        {
            // Create an empty note
            const note = {
                id : null,
                title : "",
                labels: [],
                userId: [this.userId],
                subtasks: null,
                isArchived: false,
                isTrashed: false,
            };

            this.note$ = of(note);
        }

        // Get the labels
        // this.labels$ = this._notesService.labels$;

        // Subscribe to note updates
        // this.noteChanged
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(500),
        //         switchMap(note => this._notesService.updateNote(note)))
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
     * Create a new note
     *
     * @param note
     */
    // createNote(note: Note): void
    // {
    //     this._notesService.createNote(note).pipe(
    //         map(() =>
    //         {
    //             // Get the note
    //             this.note$ = this._notesService.note$;
    //         })).subscribe();
    // }

    /**
     * Upload image to given note
     *
     * @param note
     * @param fileList
     */
    uploadImage(note: Note, fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        this._readAsDataURL(file).then((data) =>
        {
            // Update the image
            // note.image = data;

            // Update the note
            this.noteChanged.next(note);
        });
    }

    /**
     * Remove the image on the given note
     *
     * @param note
     */
    removeImage(note: Note): void
    {
        // note.image = null;

        // Update the note
        this.noteChanged.next(note);
    }

    /**
     * Add an empty tasks array to note
     *
     * @param note
     */
    addTasksToNote(note:Note): void
    {
        console.log(note.subtasks==null)
        if ( note.subtasks==null )
        {
            note.subtasks = [];
        }
        this.updateNoteSubtasks(note);
    }

    /**
     * Add task to the given note
     *
     * @param note
     * @param task
     */
    addTaskToNote(note: Note, task: string): void
    {
        if ( task.trim() === '' )
        {
            return;
        }

        note.id=Number(localStorage.getItem('noteId'));
        console.log(Number(localStorage.getItem('noteId')));
        console.log(note.id)
        note.subtasks.push({title: task, completed: false});
        console.log(JSON.stringify(note))

        // Add the task
        this.updateNoteSubtasks(note);
    }

    /**
     * Remove the given task from given note
     *
     * @param note
     * @param task
     */
    removeTaskFromNote(note: Note, task: Task): void
    {
        // Remove the task
        // note.tasks = note.tasks.filter(item => item.id !== task.id);

        // Update the note
        this.noteChanged.next(note);
    }

    /**
     * Update the given task on the given note
     *
     * @param note
     * @param task
     */
    updateTaskOnNote(note: Note, task: Task): void
    {
        // If the task is already available on the item
        if ( task.id )
        {
            // Update the note
            this.noteChanged.next(note);
        }
    }

    /**
     * Is the given note has the given label
     *
     * @param note
     * @param label
     */
    isNoteHasLabel(note: Note, label: string): boolean
    {
        // return !!note.labels.find(item => item.id === label.id);
        return false;
    }

    /**
     * Toggle the given label on the given note
     *
     * @param note
     * @param label
     */
    toggleLabelOnNote(note: Note, label: string): void
    {
        // If the note already has the label
        if ( this.isNoteHasLabel(note, label) )
        {
            // note.labels = note.labels.filter(item => item.id !== label.id);
        }
        // Otherwise
        else
        {
            note.id=Number(localStorage.getItem('noteId'));
            note.labels.push(label);
            console.log(JSON.stringify(label))
            console.log(JSON.stringify(note))

            this.updateNoteLabels(note);
        }

        // Update the note
        this.noteChanged.next(note);
    }

    /**
     * Toggle archived status on the given note
     *
     * @param note
     */
    toggleArchiveOnNote(note: Note): void
    {
        // note.archived = !note.archived;

        // Update the note
        this.noteChanged.next(note);

        // Close the dialog
        this._matDialogRef.close();
    }

    /**
     * Update the note details
     *
     * @param note
     */
    updateNoteDetails(note: Note): void
    {
        // this.noteChanged.next(note);
        setTimeout(() => {
            this.noteChanged.next(note);
        })
    }

    /**
     * Delete the given note
     *
     * @param note
     */
    deleteNote(note: Note): void
    {
        // this._notesService.deleteNote(note)
        //     .subscribe((isDeleted) =>
        //     {
        //         // Return if the note wasn't deleted...
        //         if ( !isDeleted )
        //         {
        //             return;
        //         }

        //         // Close the dialog
        //         this._matDialogRef.close();
        //     });
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Read the given file for demonstration purposes
     *
     * @param file
     */
    private _readAsDataURL(file: File): Promise<any>
    {
        // Return a new promise
        return new Promise((resolve, reject) =>
        {
            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = (): void =>
            {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e): void =>
            {
                reject(e);
            };

            // Read the file as the
            reader.readAsDataURL(file);
        });
    }
}
