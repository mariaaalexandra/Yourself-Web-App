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
    raisedAmount: number = 222; // Set the raised amount dynamically
    goalAmount: number = 500; // Set the goal amount dynamically
    goalAmount2: number = 2000; // Set the goal amount dynamically
    goalAmount3: number = 10000; // Set the goal amount dynamically
    progressPercentage: number = 0;
    progressPercentage2: number = 0;
    progressPercentage3: number = 0;

    /**
     * Constructor
     */
    constructor(
        private _donateService: DonateService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    )
    {
        this.calculateProgressPercentage();
        this.calculateProgressPercentage2();
        this.calculateProgressPercentage3();
    }
    ngOnDestroy(): void {
        
    }
    ngOnInit(): void {
        
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
}
