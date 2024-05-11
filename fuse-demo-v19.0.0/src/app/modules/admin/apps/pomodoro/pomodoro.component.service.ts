import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class pomodoroService {
    private apiUrl = 'http://localhost:8080/api/pomodoro';
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {}

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    getData(): Observable<any> {
        const mockData = {
            id: 1,
            message: "This is a mock donation data response"
        };

        return of(mockData).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
}