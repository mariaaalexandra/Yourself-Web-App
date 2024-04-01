import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Book} from '../models/Book';
import { Observable } from 'rxjs';


@Injectable()
export class BookService {

  constructor(private http: HttpClient) {}


    getBookList(): Observable<Book[]> {
      let url = "http://localhost:8080/book/bookList";

      let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        // 'x-auth-token' : localStorage.getItem('xAuthToken')
      });

      return this.http.get<Book[]>(url, {headers, responseType: 'json'});
    }

    getBook(bookId: number) {
      let url =  "http://localhost:8080/book/"+bookId;

      let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        // 'x-auth-token' : localStorage.getItem('xAuthToken')
      });

      return this.http.get<Book>(url, {headers, responseType: 'json'});
    }

  search(keyword: string) {
    let url = "http://localhost:8080/book/search";

    let headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      // 'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.post<Book []>(url, keyword, {headers, responseType: 'json'});
  }


  filterByCategory(category: string): Observable<Book[]> {
    // This URL will depend on your API.
    const url = `http://localhost:8080/book/books?category=${category}`;
    return this.http.get<Book[]>(url);
  }

  private baseUrl = 'http://localhost:8080/book';

  getSortedBooks(sortProperties: string): Observable<Book[]> {
    const url = `${this.baseUrl}/sort?sort=${sortProperties}`;
    return this.http.get<Book[]>(url);
  }
}
