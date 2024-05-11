import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { Shortcuts } from 'app/layout/common/shortcuts/shortcuts.types';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector       : 'shortcuts',
    templateUrl    : './shortcuts.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'shortcuts',
    standalone     : true,
    imports        : [MatButtonModule, MatIconModule, NgIf, MatTooltipModule, NgFor, NgClass, NgTemplateOutlet, RouterLink, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
})
export class ShortcutsComponent implements OnInit, OnDestroy
{
    @ViewChild('shortcutsOrigin') private _shortcutsOrigin: MatButton;
    @ViewChild('shortcutsPanel') private _shortcutsPanel: TemplateRef<any>;

    mode: 'view' | 'modify' | 'add' | 'edit' = 'view';
    shortcuts: Shortcuts[];
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    shortcutForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _shortcutsService: ShortcutsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.shortcutForm = this._formBuilder.group({
            selectedShortcut: [null],  // Dropdown control for selecting a shortcut
            id: [null],
            label: ['', Validators.required],
            description: [''],
            icon: ['', Validators.required],
            link: ['', Validators.required],
            useRouter: [false, Validators.required],
        });
    
        this.loadShortcuts();
    }

    loadShortcuts(): void {
        this._shortcutsService.getAll().subscribe((shortcuts: Shortcuts[]) => {
            this.shortcuts = shortcuts;
            console.log('Shortcuts loaded:', this.shortcuts); // Log loaded shortcuts to console
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
        if ( this._overlayRef )
        {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the shortcuts panel
     */
    openPanel(): void
    {
        // Return if the shortcuts panel or its origin is not defined
        if ( !this._shortcutsPanel || !this._shortcutsOrigin )
        {
            return;
        }

        // Make sure to start in 'view' mode
        this.mode = 'view';

        // Create the overlay if it doesn't exist
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._shortcutsPanel, this._viewContainerRef));
    }

    /**
     * Close the shortcuts panel
     */
    closePanel(): void
    {
        this._overlayRef.detach();
    }

    /**
     * Change the mode
     */
    changeMode(mode: 'view' | 'modify' | 'add' | 'edit'): void
    {

        if(mode == 'add')
            this.shortcutForm.reset();

        // Change the mode
        this.mode = mode;
    }

    /**
     * Prepare for a new Shortcuts
     */
    newShortcut(): void
    {
        this.shortcutForm.reset();
        // Enter the add mode
        this.mode = 'add';
    }

    /**
     * Edit a Shortcuts
     */
    editShortcut(Shortcuts: Shortcuts): void
    {
        // Reset the form with the Shortcuts
        this.shortcutForm.reset(Shortcuts);

        // Enter the edit mode
        this.mode = 'edit';
    }

    /**
     * Save Shortcuts
     */
    save(): void {
        const Shortcuts = this.shortcutForm.value;
    
        if (Shortcuts.id) {
            this._shortcutsService.update(Shortcuts.id, Shortcuts).subscribe();
            this.loadShortcuts();
        } else {
            this._shortcutsService.create(Shortcuts).subscribe();
            this.loadShortcuts();
        }
    
        this.mode = 'modify'; // Switch back to modify mode
    }

    /**
     * Delete Shortcuts
     */
    delete(): void
    {
        // Get the data from the form
        const Shortcuts = this.shortcutForm.value;

        // Delete
        this._shortcutsService.delete(Shortcuts.id).subscribe();

        // Go back the modify mode
        this.mode = 'modify';

        this.loadShortcuts();
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
     * Create the overlay
     */
    private _createOverlay(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._shortcutsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX : 'start',
                        originY : 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX : 'start',
                        originY : 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX : 'end',
                        originY : 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX : 'end',
                        originY : 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() =>
        {
            this._overlayRef.detach();
        });
    }

    onShortcutSelected(event: MatSelectChange): void {
        const selectedShortcut = event.value;
        if (selectedShortcut) {
            this.shortcutForm.patchValue({
                id: selectedShortcut.id,
                label: selectedShortcut.label,
                description: selectedShortcut.description,
                icon: selectedShortcut.icon,
                link: selectedShortcut.link,
                useRouter: selectedShortcut.useRouter
            });
        } else {
            this.shortcutForm.reset();
        }
    }

    deleteShortcut(id: string): void {
        this._shortcutsService.delete(id).subscribe(() => {
            // Remove the deleted shortcut from the local array
            this.shortcuts = this.shortcuts.filter(shortcut => shortcut.id !== id);
        });
    }
}
