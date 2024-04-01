import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from 'app/models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskManagementService {
    private baseUrl = 'http://localhost:8080/task-management'; // Adjust as necessary

    constructor(private http: HttpClient) {}

    getTasksByUserId(userId: number): Observable<any> {
      // Create HttpParams to add the userId as a query parameter
      const params = new HttpParams().set('userId', userId.toString());

      return this.http.get(`${this.baseUrl}/user`, { params });
    }

    findById(id: number): Observable<any> {
        const url = 'http://localhost:8080/task-management';
        // Create HttpParams to add the id as a query parameter
        const params = new HttpParams().set('id', id.toString());

        return this.http.get(`${url}/taskId`, { params });
      }

      saveTask(task: Task): Observable<any> {
        return this.http.post<Task>(this.baseUrl, task);
      }

      updateTask(id: number, task: Task): Observable<any> {
        const url = 'http://localhost:8080/task-management/update';

        // Create HttpParams to append the id as a query parameter
        const params = new HttpParams().set('id', id.toString());

        return this.http.put<Task>(url, task, { params });
      }

      deleteById(id: number): Observable<void> {
        // Create HttpParams to append the id as a query parameter
        const params = new HttpParams().set('id', id.toString());

        const url = 'http://localhost:8080/task-management';


        return this.http.delete<void>(`${url}/delete`, { params });
      }
}
