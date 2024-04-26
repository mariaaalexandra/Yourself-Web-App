import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Newsletter } from './newsletter.types';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NewsletterService
{
    private _newsletter: ReplaySubject<Newsletter[]> = new ReplaySubject<Newsletter[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for newsletter
     */
    get newsletter$(): Observable<Newsletter[]>
    {
        return this._newsletter.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all messages
     */
    getAll(): Observable<Newsletter[]> {
        return this._httpClient.get<Newsletter[]>('http://localhost:8080/api/newsletter').pipe(
            tap((newsletter) => {
                this._newsletter.next(newsletter);
            }),
        );
    }

    create(Newsletter: Newsletter): Observable<Newsletter> {
        return this._httpClient.post<Newsletter>('http://localhost:8080/api/newsletter', Newsletter).pipe(
            tap((newNewsletter) => {
                this.newsletter$.pipe(
                    take(1),
                    tap(newsletter => {
                        this._newsletter.next([...newsletter, newNewsletter]);
                    })
                ).subscribe();
            }),
        );
    }

    update(id: string, Newsletter: Newsletter): Observable<Newsletter> {
        return this._httpClient.put<Newsletter>(`http://localhost:8080/api/newsletter/${id}`, Newsletter).pipe(
            tap((updatedNewsletter) => {
                this.getAll().subscribe(); // Refresh the list of newsletter
            }),
        );
    }

    delete(id: string): Observable<boolean> {
        return this._httpClient.delete<boolean>(`http://localhost:8080/api/newsletter/${id}`).pipe(
            tap((isDeleted) => {
                this.getAll().subscribe(); // Refresh the list of newsletter
            }),
        );
    }
}
