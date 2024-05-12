import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        const url = 'http://localhost:8080/api/widgets';
        console.log('Attempting to create widget with URL:', url, 'and data:', widgetLayout);
    
        // Define headers
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            // Add other headers as needed
        });
    
        // Check if widget of the same componentType already exists before creating a new one
        return this.widgets$.pipe(
            take(1),
            switchMap(widgets => {
                const existingWidget = widgets.find(w => w.componentType === widgetLayout.componentType);
                if (existingWidget) {
                    console.error('Widget with same componentType already exists:', existingWidget);
                    return throwError(() => new Error('Widget with same componentType already exists'));
                } else {
                    return this._httpClient.post<WidgetLayout>(url, widgetLayout, {headers: headers}).pipe(
                        tap(newWidget => {
                            console.log('Received new widget from server:', newWidget);
                            const updatedWidgets = [...widgets, newWidget];
                            this._widgets.next(updatedWidgets);
                            console.log('Updated widgets in cache:', updatedWidgets);
                        }),
                        catchError(error => {
                            console.error('Failed to create widget:', error);
                            return throwError(() => new Error('Failed to create widget'));
                        })
                    );
                }
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
