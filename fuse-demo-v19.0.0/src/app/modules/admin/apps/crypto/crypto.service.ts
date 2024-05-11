import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CryptoService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

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
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/apps/crypto').pipe(
            tap((response: any) =>
            {
                this._data.next(response);
            }),
        );
    }
}
