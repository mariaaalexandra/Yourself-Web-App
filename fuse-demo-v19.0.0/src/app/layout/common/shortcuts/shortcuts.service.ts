import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shortcuts } from 'app/layout/common/shortcuts/shortcuts.types';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ShortcutsService
{
    private _shortcuts: ReplaySubject<Shortcuts[]> = new ReplaySubject<Shortcuts[]>(1);

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
     * Getter for shortcuts
     */
    get shortcuts$(): Observable<Shortcuts[]>
    {
        return this._shortcuts.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all messages
     */
    getAll(): Observable<Shortcuts[]> {
        return this._httpClient.get<Shortcuts[]>('http://localhost:8080/api/shortcuts').pipe(
            tap((shortcuts) => {
                this._shortcuts.next(shortcuts);
            }),
        );
    }

    create(Shortcuts: Shortcuts): Observable<Shortcuts> {
        return this._httpClient.post<Shortcuts>('http://localhost:8080/api/shortcuts', Shortcuts).pipe(
            tap((newShortcut) => {
                this.shortcuts$.pipe(
                    take(1),
                    tap(shortcuts => {
                        this._shortcuts.next([...shortcuts, newShortcut]);
                    })
                ).subscribe();
            }),
        );
    }

    update(id: string, Shortcuts: Shortcuts): Observable<Shortcuts> {
        return this._httpClient.put<Shortcuts>(`http://localhost:8080/api/shortcuts/${id}`, Shortcuts).pipe(
            tap((updatedShortcut) => {
                this.getAll().subscribe(); // Refresh the list of shortcuts
            }),
        );
    }

    delete(id: string): Observable<boolean> {
        return this._httpClient.delete<boolean>(`http://localhost:8080/api/shortcuts/${id}`).pipe(
            tap((isDeleted) => {
                this.getAll().subscribe(); // Refresh the list of shortcuts
            }),
        );
    }
}
