import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
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
import { MatTableModule } from '@angular/material/table';

@Component({
    selector       : 'opensourcecontributions',
    templateUrl    : './opensourcecontributions.component.html',
    styleUrls      : ['./opensourcecontributions.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatSidenavModule, NgFor, MatTableModule, DatePipe, MatIconModule, NgClass, NgApexchartsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NgIf, FormsModule, MatInputModule, MatButtonModule, UpperCasePipe, DecimalPipe, CurrencyPipe],
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
                    this.contributors = data.map(contributor => ({
                        id: contributor.id,
                        login: contributor.login,
                        avatar_url: contributor.avatar_url,
                        commits: [] // Initialize an empty array for commits
                    }));
    
                    // After loading contributors, fetch commits for each
                    this.contributors.forEach(contributor => {
                        this.getCommits(contributor);
                    });
    
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
    
    getCommits(contributor: any) {
        console.log('Starting getCommits() method for:', contributor.login);
        console.log('Before HTTP GET request for commits...');
    
        this.http.get<any[]>('https://api.github.com/repos/ClaudiuChelcea/Tanktions---a-tank-game/commits')
            .subscribe(
                (commitsData) => {
                    console.log('Received commits data:', commitsData);
    
                    // Filter commits based on contributor's login
                    const filteredCommits = commitsData.filter(commit => commit.author.login === contributor.login);
                    
                    console.log('Filtered commits for contributor', contributor.login, ':', filteredCommits);
                    
                    // Assign filtered commits to contributor object
                    contributor.commits = filteredCommits;
                    
                    // Update the commits count
                    this.commitsCount += contributor.commits.length;
    
                    // Trigger change detection to update the view
                    this.cdr.detectChanges();
                },
                (error) => {
                    console.error('Error fetching commits for', contributor.login, ':', error);
                }
            );
    
        console.log('After HTTP GET request for commits...');
    }
}
