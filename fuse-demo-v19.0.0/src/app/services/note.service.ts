// note.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from 'app/models/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl = 'http://localhost:8080/api/notes/add'; // Adjust this URL to match your actual backend

  constructor(private http: HttpClient) { }

  createNote(note: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, note);
  }

  getAllNotesForUser(userId: number): Observable<any> {
    // Setting up HTTP params
    let params = new HttpParams().set('id', userId.toString());
    const url = 'http://localhost:8080/api/notes';

    return this.http.get(url, { params: params });
  }

  updateNoteSubtasks(id: number, note: any): Observable<any> {
    const url = `http://localhost:8080/api/notes/updateSubtasks/?id=${id}`;
    return this.http.put(url, note);
  }

  updateNoteLabels(id: number, note: any): Observable<any> {
    const url = `http://localhost:8080/api/notes/updateLabels?id=${id}`;
    return this.http.put(url, note);
  }

  deleteNote(note:Note) {
    const url = 'http://localhost:8080/api/notes'; // Adjust the URL as necessary
    const params = new HttpParams().set('id', note.id.toString());
    return this.http.post<void>(`${url}/remove`, null, { params });

    // return this.http.post(url, null, options);
  }

  deleteNoteById(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.post<void>(`${this.baseUrl}/remove`, null, { params });
  }
}
