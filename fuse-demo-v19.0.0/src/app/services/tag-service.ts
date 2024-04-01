import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from 'app/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private baseUrl = 'http://localhost:8080/api/tags/user';  // Adjust the base URL as needed

  constructor(private http: HttpClient) { }

  getTagsByUserId(userId: number): Observable<any> {
    const url = `${this.baseUrl}?userId=${userId}`;
    return this.http.get(url);
  }

  createTag(tag: Tag): Observable<Tag> {
    const url = 'http://localhost:8080/api'
    return this.http.post<Tag>(`${url}/tags`, tag); // Adjust the URL path as needed
  }
}
