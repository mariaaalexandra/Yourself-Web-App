import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, List } from 'app/modules/admin/apps/board/scrumboard.models';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
    private baseUrl = 'http://localhost:8080/api/boards'; // Adjust as necessary

    constructor(private http: HttpClient) {}

    getBoardsByMemberId(memberId: number): Observable<Board[]> {
      // Set up HttpParams to include memberId as a query parameter
      const params = new HttpParams().set('memberId', memberId.toString());

      return this.http.get<Board[]>(`${this.baseUrl}/member`, { params });
    }

    getBoardById(id: number): Observable<any> {
        // Construct the URL with the query parameter
        const url = `${this.baseUrl}/getBoard?id=${id}`;
        // Make the GET request and return the observable
        return this.http.get(url);
      }

      getListsByBoardId(boardId: number): Observable<List[]> {
        return this.http.get<List[]>(`${this.baseUrl}/lists`, { params: { boardId } });
      }


      addListToBoard(boardId: number, newList: any): Observable<any> {
        const apiUrl = 'http://localhost:8080/api/boards/addList'
        // Set up the query parameters
        let params = new HttpParams().set('boardId', boardId.toString());

        // Make the POST request
        return this.http.post(`${apiUrl}/addList`, newList, { params: params });
      }

      deleteCard(boardId: number, listId: number, cardId: number): Observable<boolean> {
        const params = new HttpParams()
          .set('boardId', boardId.toString())
          .set('listId', listId.toString())
          .set('cardId', cardId.toString());

        return this.http.post<boolean>('http://localhost:8080/api/boards/cards/delete', null, { params });
      }

      deleteList(boardId: number, listId: number): Observable<any> {
        const params = new HttpParams()
          .set('boardId', boardId.toString())
          .set('listId', listId.toString());

        return this.http.delete('http://localhost:8080/api/boards/lists/delete', { params });
      }


}
