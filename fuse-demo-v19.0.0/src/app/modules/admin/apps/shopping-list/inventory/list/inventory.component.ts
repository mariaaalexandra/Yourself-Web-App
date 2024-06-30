import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryService } from 'app/modules/admin/apps/shopping-list/inventory/inventory.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/shopping-list/inventory/inventory.types';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector       : 'inventory-list',
    templateUrl    : './inventory.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
})
export class InventoryListComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;

    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: UntypedFormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _inventoryService: InventoryService,
        private http: HttpClient,
        private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer
    )
    {
        this.iconRegistry.addSvgIcon(
            'custom-icon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon3.svg')
          )

          this.iconRegistry.addSvgIcon(
            'custom-icon1',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon4.svg')
          )
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the selected product form
        this.selectedProductForm = this._formBuilder.group({
            id               : [''],
            category         : [''],
            name             : [''],
            description      : [''],
            tags             : [[]],
            brand            : [''],
            vendor           : [''],
            stock            : [''],
            cost             : [''],
            price            : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false],
        });



        // Get the brands
        this._inventoryService.brands$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((brands: InventoryBrand[]) =>
            {
                // Update the brands
                this.brands = brands;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the categories
        this._inventoryService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: InventoryCategory[]) =>
            {
                // Update the categories
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) =>
            {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.products$ = this._inventoryService.products$;

        // Get the tags
        this._inventoryService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: InventoryTag[]) =>
            {
                // Update the tags
                this.tags = tags;
                this.filteredTags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the vendors
        this._inventoryService.vendors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vendors: InventoryVendor[]) =>
            {
                // Update the vendors
                this.vendors = vendors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() =>
                {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            ).subscribe();
        }
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

    toggleProductTags(tag: any, event: any): void {
        const tags = this.selectedProductForm.get('tags').value;
        if (event.checked) {
            tags.push(tag.id);
        } else {
            const index = tags.indexOf(tag.id);
            if (index > -1) {
                tags.splice(index, 1);
            }
        }
        this.selectedProductForm.get('tags').setValue(tags);
    }
    /**
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(productId: string): void
    {
        // If the product is already selected...
        if ( this.selectedProduct && this.selectedProduct.id === productId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._inventoryService.getProductById(productId)
            .subscribe((product) =>
            {
                let iBrand=null;
                for (let i = 0; i < this.brands.length; i++) {
                    if(product.brand)
                    if (this.brands[i].name === product.brand.name) {
                        iBrand = this.brands[i];
                        break;
                    }
                }

                let iCategory=null;
                for (let i = 0; i < this.categories.length; i++) {
                    if(product.category)
                    if (this.categories[i].name === product.category.name) {
                        iCategory = this.categories[i];
                        break;
                    }
                }

                let iVendor=null;
                for (let i = 0; i < this.vendors.length; i++) {
                    if(product.vendor)
                    if (this.vendors[i].name === product.vendor.name) {
                        iVendor = this.vendors[i];
                        break;
                    }
                }
                // Set the selected product
                product.brand=iBrand
                product.category=iCategory
                product.vendor=iVendor
                this.selectedProduct = product;


                // Fill the form
                this.selectedProductForm.patchValue(this.selectedProduct);
                this.selectedProductForm.patchValue({
                    brand: iBrand.id
                });
                this.selectedProductForm.patchValue({
                    tags:this.selectedProduct.tags.map(tag => tag.id)
                })
                if(iCategory)
                this.selectedProductForm.patchValue({
                    category: iCategory.id
                });
                if(iVendor)
                this.selectedProductForm.patchValue({
                    vendor: iVendor.id
                });
                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;

    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex = this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        }
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
        const isTagApplied = this.selectedProduct.tags.find(id => id === tag.id);

        // If the found tag is already applied to the product...
        if ( isTagApplied )
        {
            // Remove the tag from the product
            this.removeTagFromProduct(tag);
        }
        else
        {
            // Otherwise add the tag to the product
            this.addTagToProduct(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title,
        };

        console.log("ola")

        // Create tag on the server
        this._inventoryService.createTag(tag)
            .subscribe((response) =>
            {
                // Add the tag to the product
                this.addTagToProduct(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: InventoryTag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._inventoryService.updateTag(tag.id, tag)
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
    deleteTag(tag: InventoryTag): void
    {
        // Delete the tag from the server
        this._inventoryService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the product
     *
     * @param tag
     */
    addTagToProduct(tag: InventoryTag): void {
        // Check if the selectedProduct and its id are defined
        if (!this.selectedProduct || !this.selectedProduct.id) {
            console.error('Selected product or product ID is undefined');
            return;
        }

        // Create the query params with the product ID
        const params = new HttpParams().set('productId', this.selectedProduct.id.toString());

        // Call the API to add the tag to the product
        this.http.post<InventoryProduct>('http://localhost:8080/api/products/addTagToProduct', tag, { params }).subscribe({
            next: (product) => {
                // Assuming that `selectedProduct` is a type that includes a tags array
                this.selectedProduct.tags.unshift(tag); // Add the tag to the local array

                // Update the selected product form if it's used to display data
                if (this.selectedProductForm && this.selectedProductForm.get('tags')) {
                    this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            },
            error: (error) => {
                console.error('Error adding tag to product:', error);
            }
        });
    }

    /**
     * Remove tag from the product
     *
     * @param tag
     */
    removeTagFromProduct(tag: InventoryTag): void {
        // Ensure that the selected product and tag IDs are defined
        if (!this.selectedProduct || !this.selectedProduct.id || !tag.id) {
            console.error('Selected product or tag ID is undefined');
            return;
        }

        // Make the DELETE request
        const params = new HttpParams()
            .set('productId', this.selectedProduct.id.toString())
            .set('tagId', tag.id.toString());

        this.http.delete('http://localhost:8080/api/products/removeTag', { params }).subscribe({
            next: () => {
                // Remove the tag id from the local array of tag ids
                const index = this.selectedProduct.tags.indexOf(tag);
                if (index !== -1) {
                    this.selectedProduct.tags.splice(index, 1);

                    // Update the form if it's being used
                    if (this.selectedProductForm && this.selectedProductForm.get('tags')) {
                        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);
                    }

                    // Mark for check to update the UI
                    this._changeDetectorRef.markForCheck();
                }
            },
            error: (error) => {
                console.error('Error removing tag from product:', error);
                // Handle error
            }
        });
    }



    /**
     * Toggle product tag
     *
     * @param tag
     * @param change
     */
    toggleProductTag(tag: InventoryTag, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addTagToProduct(tag);
        }
        else
        {
            this.removeTagFromProduct(tag);
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
     * Create product
     */
    createProduct(productData: InventoryProduct): void {

        // Create the product using the provided product data
        this._inventoryService.createProduct(productData).subscribe((newProduct) => {
            // Go to new product
            this.selectedProduct = newProduct;

            // // Fill the form with the new product data
            this.selectedProductForm.patchValue(newProduct);

            console.log(newProduct);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

    }



    /**
     * Update the selected product using the form data
     */
    updateSelectedProduct(): void
    {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();
        console.log("produs " + JSON.stringify(product))

        // Remove the currentImageIndex field
        // delete product.currentImageIndex;

        const category = this.selectedProductForm.get('category').value;
        const brand = this.selectedProductForm.get('brand').value;
        const vendor = this.selectedProductForm.get('vendor').value;
        const tags = this.selectedProductForm.get('tags').value;



        let iBrand=null;
        let iBrandId=null;
        for (let i = 0; i < this.brands.length; i++) {
            if (this.brands[i].id === brand) {
                iBrand = this.brands[i];
                iBrandId = iBrand.id;
                break;
            }
        }

        iBrand.id = null
        product.brand = iBrand

        let iCategory=null;
        let iCategoryId=null;
        for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].id === category) {
                iCategory = this.categories[i];
                iCategoryId = iCategory.id;
                break;
            }
        }

        iCategory.id = null
        product.category = iCategory

        let iVendor=null;
        let iVendorId=null;
        for (let i = 0; i < this.vendors.length; i++) {
            if (this.vendors[i].id === vendor) {
                iVendor = this.vendors[i];
                iVendorId = iVendor.id;
                break;
            }
        }

        iVendor.id = null
        product.vendor = iVendor


        // Update the product on the server
        this._inventoryService.updateProduct(product.id, product).subscribe(() =>
        {
            // Show a success message
            this.showFlashMessage('success');

        });

        window.location.reload()


    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete product',
            message: 'Are you sure you want to remove this product? This action cannot be undone!',
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
                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                this._inventoryService.deleteProduct(product.id).subscribe(() =>
                {
                    // Close the details
                    this.closeDetails();
                });
            }
            window.location.reload()

        });

    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() =>
        {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
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
