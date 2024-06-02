import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DonateService } from 'app/modules/admin/contribute/donate/donate.service';
import { DateTime } from 'luxon';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../../src/environment';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector       : 'donate',
    templateUrl    : './donate.component.html',
    styleUrls      : ['./donate.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatSidenavModule, NgFor, MatIconModule, NgClass, NgApexchartsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NgIf, FormsModule, MatInputModule, MatButtonModule, UpperCasePipe, DecimalPipe, CurrencyPipe],
})
export class donateComponent implements OnInit, OnDestroy
{
    showThankYouModal: boolean = false;

    raisedAmount: number; // Set the raised amount dynamically
    goalAmount: number = 500; // Set the goal amount dynamically
    goalAmount2: number = 2000; // Set the goal amount dynamically
    goalAmount3: number = 10000; // Set the goal amount dynamically
    progressPercentage: number = 0;
    progressPercentage2: number = 0;
    progressPercentage3: number = 0;
    selectedAmount: number; // Variable to hold the selected amount

    /**
     * Constructor
     */
    constructor(
        private _donateService: DonateService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private http: HttpClient,
        private route: ActivatedRoute

    )
    {
    }
    ngOnDestroy(): void {

    }
    ngOnInit(): void {
        this._donateService.getTotalAmount().subscribe(
            (amount: number) => {
              this.raisedAmount = amount;
              console.log("Sum " + this.raisedAmount);
              this.calculateProgressPercentage();
              this.calculateProgressPercentage2();
              this.calculateProgressPercentage3();

              console.log("Progress percentage" + this.progressPercentage);
              this._changeDetectorRef.detectChanges(); // Manually trigger change detection

            },
            (error) => {
              console.error('Error fetching total amount:', error);
            }
          );

          this.route.queryParams.subscribe(params => {
            if (params['status'] === 'success') {
              this.showThankYouModal = true;

            }
          });
        }


    calculateProgressPercentage() {
        this.progressPercentage = (this.raisedAmount / this.goalAmount) * 100;
    }

    calculateProgressPercentage2() {
        this.progressPercentage2 = (this.raisedAmount / this.goalAmount2) * 100;
    }

    calculateProgressPercentage3() {
        this.progressPercentage3 = (this.raisedAmount / this.goalAmount3) * 100;
    }

    stripePromise = loadStripe('pk_test_51PLVHkRvWgDRXXMzPPCKnHyGsHynCF3UXKgHdm8w27cjfPyaTZhs7jIZfvvS5J3SZNVs4KCcA1YtIxwhoEKlXhme00CGsh9HSK');

    async pay(): Promise<void> {
      const payment = {
        name: 'Donation',
        currency: 'usd',
        amount: this.selectedAmount * 100,
        quantity: '1',
        cancelUrl: 'http://localhost:4200/cancel',
        successUrl: 'http://localhost:8081/contribute/donate?status=success',
    };

      const stripe = await this.stripePromise;

      // this is a normal http calls for a backend api
      this.http
        .post(`http://localhost:8080/api/payment`, payment)
        .subscribe((data: any) => {
          // I use stripe to redirect To Checkout page of Stripe platform
          stripe.redirectToCheckout({
            sessionId: data.id,
          });
        });
        }

        onCustomAmountInput(event: Event): void {
            const inputElement = event.target as HTMLInputElement;
            this.selectedAmount = parseFloat(inputElement.value);
          }

          closeThankYouModal(): void {
            this.showThankYouModal = false;
          }
}
