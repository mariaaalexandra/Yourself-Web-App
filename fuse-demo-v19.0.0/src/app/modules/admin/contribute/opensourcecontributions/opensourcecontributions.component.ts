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
import { opensourcecontributionsService } from 'app/modules/admin/contribute/opensourcecontributions/opensourcecontributions.service';
import { DateTime } from 'luxon';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';

@Component({
    selector       : 'opensourcecontributions',
    templateUrl    : './opensourcecontributions.component.html',
    styleUrls      : ['./opensourcecontributions.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatSidenavModule, NgFor, MatIconModule, NgClass, NgApexchartsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NgIf, FormsModule, MatInputModule, MatButtonModule, UpperCasePipe, DecimalPipe, CurrencyPipe],
})

export class opensourcecontributionsComponent implements OnInit, OnDestroy
{
    
    contributorsCount: number = 0; // Set the goal amount dynamically
    commitsCount: number = 0; // Set the goal amount dynamically
    contributors: any[];
    commits: any[];


    /**
     * Constructor
     */
    constructor(
        private _opensourcecontributionsService: opensourcecontributionsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private http2: HttpClient
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getContributors();
        this.getCommits();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        
    }

    getContributors() {
        console.log('Starting getContributors() method...');
        console.log('Before HTTP GET request...');
        this.http.get<any[]>('https://api.github.com/repos/ClaudiuChelcea/Tanktions---a-tank-game/contributors')
            .subscribe(
                (data) => {
                    console.log('Received data:', data);
                    // Destructure the data array to extract individual elements
                    for (const { id, login, avatar_url } of data) {
                        // Map each element to variables or process them as needed
                        console.log('ID:', id);
                        console.log('Login:', login);
                        console.log('Avatar URL:', avatar_url);
                        // You can assign these variables to class properties if needed
                    }

                    this.contributorsCount = data.length;
                    this.cdr.detectChanges();
                    console.log("Contributors count: " + this.contributorsCount);
                },
                (error) => {
                    console.error('Error fetching contributors:', error);
                }
            );
        console.log('After HTTP GET request...');
    }

    getCommits() {
        console.log('Starting getCommits() method...');
        console.log('Before HTTP GET request for commits...');
    
        this.http2.get<any[]>('https://api.github.com/repos/ClaudiuChelcea/Tanktions---a-tank-game/commits')
            .subscribe(
                (commitsData) => {
                    console.log('Received commits data:', commitsData);
                    this.commits = commitsData.map(commit => {
                        const { sha, commit: { author: { name, date }, message } } = commit;
                        console.log('Commit SHA:', sha);
                        console.log('Author:', name);
                        console.log('Date:', date);
                        console.log('Message:', message);
                        return { sha, name, date, message }; // Map each commit to an object with desired details
                    });
    
                    this.commitsCount = commitsData.length;
                    console.log('Commits count:', this.commitsCount);
                    this.cdr.detectChanges();  // Update the view if needed
                },
                (error) => {
                    console.error('Error fetching commits:', error);
                }
            );
        console.log('After HTTP GET request for commits...');
    }
}
