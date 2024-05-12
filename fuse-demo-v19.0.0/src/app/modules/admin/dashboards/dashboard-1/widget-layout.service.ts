import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';

export interface WidgetLayout {
  id: String;
  cols: number;
  rows: number;
  x: number;
  y: number;
  componentType: string;
}

@Injectable({
  providedIn: 'root'
})

export class WidgetLayoutService
{
    private _widgets: ReplaySubject<WidgetLayout[]> = new ReplaySubject<WidgetLayout[]>(1);

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
     * Getter for widgets
     */
    get widgets$(): Observable<WidgetLayout[]>
    {
        return this._widgets.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all messages
     */
    getAll(): Observable<WidgetLayout[]> {
        return this._httpClient.get<WidgetLayout[]>('http://localhost:8080/api/widgets').pipe(
            tap((widgets) => {
                this._widgets.next(widgets);
            }),
        );
    }

    create(widgetLayout: WidgetLayout): Observable<WidgetLayout> {
      console.log('Sending request to create widget with data:', widgetLayout);
      return this._httpClient.post<WidgetLayout>('http://localhost:8080/api/widgets', widgetLayout).pipe(
          tap((newWidget) => {
              console.log('Received new widget from server:', newWidget);
              this.widgets$.pipe(
                  take(1),
                  tap(widgets => {
                      console.log('Current widgets in cache before adding new one:', widgets);
                      this._widgets.next([...widgets, newWidget]);
                      console.log('Updated widgets in cache:', [...widgets, newWidget]);
                  })
              ).subscribe();
          }),
          catchError(error => {
              console.error('Failed to create widget:', error);
              return throwError(() => new Error('Failed to create widget'));
          })
      );
  }
  
  update(id: String, widgetLayout: WidgetLayout): Observable<WidgetLayout> {
      console.log(`Sending request to update widget with id ${id} and data:`, widgetLayout);
      return this._httpClient.put<WidgetLayout>(`http://localhost:8080/api/widgets/${id}`, widgetLayout).pipe(
          tap((updatedWidget) => {
              console.log('Received updated widget from server:', updatedWidget);
              this.getAll().subscribe(); // Optionally, consider caching rather than refetching
          }),
          catchError(error => {
              console.error(`Failed to update widget with id ${id}:`, error);
              return throwError(() => new Error(`Failed to update widget with id ${id}`));
          })
      );
  }

    delete(id: String): Observable<boolean> {
        return this._httpClient.delete<boolean>(`http://localhost:8080/api/widgets/${id}`).pipe(
            tap((isDeleted) => {
                this.getAll().subscribe(); // Refresh the list of widgets
            }),
        );
    }
}
