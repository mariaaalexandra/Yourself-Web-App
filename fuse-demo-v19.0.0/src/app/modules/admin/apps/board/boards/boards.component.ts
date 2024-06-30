import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Board } from 'app/modules/admin/apps/board/scrumboard.models';
import { ScrumboardService } from 'app/modules/admin/apps/board/scrumboard.service';
import { BoardService } from 'app/services/board-service';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';




@Component({
    selector       : 'scrumboard-boards',
    templateUrl    : './boards.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [CdkScrollable, NgFor, RouterLink, MatIconModule, NgIf],
})

export class ScrumboardBoardsComponent implements OnInit, OnDestroy
{
    boards: Board[];
    memberId: number = Number(localStorage.getItem("userId"))
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _scrumboardService: ScrumboardService,
        private boardService: BoardService,
        private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer    )
    {
        this.iconRegistry.addSvgIcon(
            'custom-icon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon1.svg')
          );

          this.iconRegistry.addSvgIcon(
            'custom-icon2',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon2.svg')
          );
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the boards
        this._scrumboardService.boards$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((boards: Board[]) =>
            {
                this.boards = boards;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        this.loadBoardsForMember();

    }

    loadBoardsForMember(): void {
        this.boardService.getBoardsByMemberId(this.memberId)
         // This ensures unsubscription when _unsubscribeAll is triggered
          .subscribe({
            next: (boards) => {
              this.boards = boards;
              this._changeDetectorRef.markForCheck(); // Trigger change detection
              console.log(this.boards)
            },
            error: (error) => {
              console.error('Error fetching boards for member:', error);
              // Handle errors here
            }
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Format the given ISO_8601 date as a relative date
     *
     * @param date
     */
    formatDateAsRelative(date: string): string
    {
        return DateTime.fromISO(date).toRelative();
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
