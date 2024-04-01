import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Book} from '../models/Book';

@Injectable()
export class BookListService {

  constructor(private http: HttpClient) { }

  getBookList() {
    let url = "http://localhost:8080/book/bookList";
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Book[]>(url, {headers, responseType: 'json'});
  }

}
