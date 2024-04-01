import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Label } from 'app/models/Lable';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private apiUrl = 'http://localhost:8080/api/noteLabels'; // Change this to your actual backend API URL

  constructor(private http: HttpClient) { }

  createNoteLabel(label: Label): Observable<any> {
    return this.http.post(this.apiUrl, label);
  }


  getAllNoteLabels(userId: number): Observable<any> {
    // Constructing HTTP parameters
    let params = new HttpParams().set('id', userId.toString());

    // The URL should match your backend endpoint
    const url = 'http://localhost:8080/api/noteLabels';

    // Making the GET request with the user ID as a query parameter
    return this.http.get(url, { params: params });
  }

  deleteNoteLabel(id: number) {
    const url = 'http://localhost:8080/api/noteLabels/remove'; // Adjust the URL as necessary
    const options = { params: new HttpParams().set('id', id.toString()) };

    return this.http.post(url, {}, options);
  }
}
