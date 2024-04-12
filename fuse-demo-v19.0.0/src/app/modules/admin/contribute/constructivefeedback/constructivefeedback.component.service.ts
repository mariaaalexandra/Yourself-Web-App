import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConstructiveFeedbackService {
    private apiUrl = 'http://localhost:8080/api/constructivefeedback';
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

    submitFeedback(feedbackData: any): Observable<any> {
        // Log the data being sent
        console.log('Sending data:', feedbackData);

        return this.http.post(this.apiUrl, feedbackData, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json' // Ensure that content type is set if required by the server
            }),
            observe: 'response' // To get the full response instead of just the body
        }).pipe(
            tap(response => {
                // Log the full HTTP response including headers
                console.log('HTTP response:', response);
            }),
            catchError(error => {
                // Log the HTTP error
                console.error('Error submitting feedback:', error);
                console.error('Status code:', error.status);
                console.error('Error status:', error.statusText);
                console.error('Error body:', error.error);

                // Re-throw the error for further handling if necessary
                return throwError(() => error);
            })
        );
    }
}