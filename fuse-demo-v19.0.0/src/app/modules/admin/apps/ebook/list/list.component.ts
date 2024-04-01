import { CdkScrollable } from '@angular/cdk/scrolling';
import { I18nPluralPipe, NgClass, NgFor, NgIf, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationExtras, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { Book } from 'app/models/Book';
import { AcademyService } from 'app/modules/admin/apps/ebook/academy.service';
import { Category, Course } from 'app/modules/admin/apps/ebook/academy.types';
import { BookListService } from 'app/services/book-list.service';
import { BookService } from 'app/services/book.service';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'academy-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [CdkScrollable, MatFormFieldModule, MatSelectModule, MatOptionModule, NgFor, MatIconModule, MatInputModule, MatSlideToggleModule, NgIf, NgClass, MatTooltipModule, MatProgressBarModule, MatButtonModule, RouterLink, FuseFindByKeyPipe, PercentPipe, I18nPluralPipe],
})
export class AcademyListComponent implements OnInit, OnDestroy
{
    showActiveBooks: boolean = false;
    public bookList: Book[] = new Array;
    categories: Category[];
    public category: string = "";
    public listCategories: string[] = ["Adventure", "Biography", "Romance", "Tragedy", "Fantasy"]
    courses: Course[];
    filteredCourses: Course[];
    filteredBooks: Book[] = new Array;
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
        category$: BehaviorSubject<string>;

    } = {
        categorySlug$ : new BehaviorSubject('all'),
        category$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false),
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _academyService: AcademyService,
        public bookListService: BookListService,
        private bookService: BookService,    )
    {
    }



    redirectToPublisher(publisherUrl: string): void {
        window.open(publisherUrl, '_blank');
    }

    getBookList() {
        this.bookListService.getBookList().subscribe(
          res => {
            console.log(res);
            this.bookList = res;
          },
          error => {
            console.log(error);
          }
        );
      }


      onFilterByCategory(change: MatSelectChange) {

        if (change.value==="all") {
            this.getBookList();
        } else
        this.bookService.filterByCategory(change.value).subscribe(
          res => {
            this.bookList = res;
            console.log(res);
          },
          error => {
            console.log(error);
          }
        );
      }

      onSearchByTitle(keyword: string) {
        this.bookService.search(keyword).subscribe(
          res => {
            this.bookList = res;
            console.log(res);
          },
          error => {
            console.log(error);
          }
        );
      }

      onToggleCompleted(event: any): void {
        this.showActiveBooks = event.checked;
        console.log("ev " + event.checked) // event.checked will be true or false based on the toggle
        this.filteredBooks = this.showActiveBooks ? this.bookList.filter(book => book.active) : [...this.bookList];
        if(this.showActiveBooks) {
            this.bookList = this.filteredBooks
            console.log("pi " + this.bookList)
        }
        else {
            this.getBookList()
            console.log("pip " + this.bookList)

        }
        this._changeDetectorRef.detectChanges();
      }


          /**
     * Filter by category
     *
     * @param change
     */
    filterByCategory(change: MatSelectChange): void
    {
        this.filters.categorySlug$.next(change.value);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getBookList();
        console.log(this.bookList);

        // Get the categories
        this._academyService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) =>
            {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the courses
        this._academyService.courses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((courses: Course[]) =>
            {
                this.courses = this.filteredCourses = courses;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Filter the courses
        combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([categorySlug, query, hideCompleted]) =>
            {
                // Reset the filtered courses
                this.filteredCourses = this.courses;

                // Filter by category
                if ( categorySlug !== 'all' )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.category === categorySlug);
                }

                // Filter by search query
                if ( query !== '' )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.title.toLowerCase().includes(query.toLowerCase())
                        || course.description.toLowerCase().includes(query.toLowerCase())
                        || course.category.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                if ( hideCompleted )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.progress.completed === 0);
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
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.filters.query$.next(query);
    }


    /**
     * Show/hide completed courses
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void
    {
        this.filters.hideCompleted$.next(change.checked);
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
