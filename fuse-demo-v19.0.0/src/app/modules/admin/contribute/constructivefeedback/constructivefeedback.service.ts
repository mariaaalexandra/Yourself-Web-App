import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class constructivefeedbackService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor() { }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    getData(): Observable<any> {
        // Mock response data
        const mockData = {
            id: 1,
            message: "This is a mock donation data response"
        };

        // Simulate an API call with mock data
        return of(mockData).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
}
