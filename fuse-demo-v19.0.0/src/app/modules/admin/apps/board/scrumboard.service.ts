import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Board, Card, Label, List } from 'app/modules/admin/apps/board/scrumboard.models';
import { BoardService } from 'app/services/board-service';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScrumboardService
{
    // Private
    private _board: BehaviorSubject<Board | null>;
    private _boards: BehaviorSubject<Board[] | null>;
    private _card: BehaviorSubject<Card | null>;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private boardService: BoardService,
        private http: HttpClient,
        private h:HttpClient
    )
    {
        // Set the private defaults
        this._board = new BehaviorSubject(null);
        this._boards = new BehaviorSubject(null);
        this._card = new BehaviorSubject(null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for board
     */
    get board$(): Observable<Board>
    {
        return this._board.asObservable();
    }

    /**
     * Getter for boards
     */
    get boards$(): Observable<Board[]>
    {
        return this._boards.asObservable();
    }

    /**
     * Getter for card
     */
    get card$(): Observable<Card>
    {
        return this._card.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get boards
     */
    getBoards(): Observable<Board[]>
    {
        return this._httpClient.get<Board[]>('api/apps/scrumboard/boards').pipe(
            map(response => response.map(item => new Board(item))),
            tap(boards => this._boards.next(boards)),
        );
    }

    /**
     * Get board
     *
     * @param id
     */
    getBoard(id: number): Observable<Board>
    {
        // return this._httpClient.get<Board>('api/apps/board', {params: {id}}).pipe(
        //     map(response => new Board(response)),
        //     tap(board => this._board.next(board)),
        // );
        // return this.boardService.getBoardById(id).pipe(map(response => new Board(response)),
        //     tap(board => this._board.next(board)),);
            const baseUrl = 'http://localhost:8080/api/boards'; // Adjust as necessary

            const url = `${baseUrl}/getBoard?id=${id}`;
            // Make the GET request and return the observable
            return this.http.get<Board>(url).pipe(map(response => new Board(response)),
            tap(board => this._board.next(board)),)

    }



    /**
     * Create board
     *
     * @param board
     */
    createBoard(board: Board): Observable<Board>
    {
        return this.boards$.pipe(
            take(1),
            switchMap(boards => this._httpClient.put<Board>('api/apps/scrumboard/board', {board}).pipe(
                map((newBoard) =>
                {
                    // Update the boards with the new board
                    this._boards.next([...boards, newBoard]);

                    // Return new board from observable
                    return newBoard;
                }),
            )),
        );
    }

    /**
     * Update the board
     *
     * @param id
     * @param board
     */
    updateBoard(id: string, board: Board): Observable<Board>
    {
        return this.boards$.pipe(
            take(1),
            switchMap(boards => this._httpClient.patch<Board>('api/apps/scrumboard/board', {
                id,
                board,
            }).pipe(
                map((updatedBoard) =>
                {
                    // Find the index of the updated board
                    const index = boards.findIndex(item => item.id === Number(id));

                    // Update the board
                    boards[index] = updatedBoard;

                    // Update the boards
                    this._boards.next(boards);

                    // Return the updated board
                    return updatedBoard;
                }),
            )),
        );
    }

    /**
     * Delete the board
     *
     * @param id
     */
    deleteBoard(id: string): Observable<boolean>
    {
        return this.boards$.pipe(
            take(1),
            switchMap(boards => this._httpClient.delete('api/apps/scrumboard/board', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted board
                    const index = boards.findIndex(item => item.id === Number(id));

                    // Delete the board
                    boards.splice(index, 1);

                    // Update the boards
                    this._boards.next(boards);

                    // Update the board
                    this._board.next(null);

                    // Update the card
                    this._card.next(null);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }

    /**
     * Create list
     *
     * @param list
     */
    createList(list: List): Observable<List>
    {
        const apiUrl = 'http://localhost:8080/api/boards'
        // Set up the query parameters
        let params = new HttpParams().set('boardId', Number(list.boardId));

        // Make the POST request
        return this.http.post<List>(`${apiUrl}/addList`, list, { params: params }).pipe(
            map(response => new List(response)),
            tap((newList) => {
                const board = this._board.value;

                // Update the board lists with the new list
                board.lists = [...board.lists, newList];

                // Sort the board lists
                board.lists.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            }
            )
        );



        return this._httpClient.post<List>('api/apps/scrumboard/board/list', {list}).pipe(
            map(response => new List(response)),
            tap((newList) =>
            {
                // Get the board value
                const board = this._board.value;

                // Update the board lists with the new list
                board.lists = [...board.lists, newList];

                // Sort the board lists
                board.lists.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            }),
        );
    }

    /**
     * Update the list
     *
     * @param list
     */
    updateList(list: List): Observable<List>
    {
        const apiUrl = 'http://localhost:8080/api/boards/lists/updateTitle';
        const params = new HttpParams()
        .set('boardId', list.boardId)
        .set('listId', list.id)
        .set('newTitle', list.title);

      // Make the POST request
      return this.http.post<List>(`${apiUrl}`, null, { params }).pipe(
        map(response => new List(response)),
        tap((updatedList)=> {
            // Get the board value
            const board = this._board.value;

            // Find the index of the updated list
            const index = board.lists.findIndex(item => item.id === list.id);

            // Update the list
            board.lists[index] = updatedList;

            // Sort the board lists
            board.lists.sort((a, b) => a.position - b.position);

            // Update the board
            this._board.next(board);
        }
        )
      );


        return this._httpClient.patch<List>('api/apps/scrumboard/board/list', {list}).pipe(
            map(response => new List(response)),
            tap((updatedList) =>
            {
                // Get the board value
                const board = this._board.value;

                // Find the index of the updated list
                const index = board.lists.findIndex(item => item.id === list.id);

                // Update the list
                board.lists[index] = updatedList;

                // Sort the board lists
                board.lists.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            }),
        );
    }

    /**
     * Update the lists
     *
     * @param lists
     */
    updateLists(lists: List[]): Observable<List[]>
    {
        return this._httpClient.patch<List[]>('api/apps/scrumboard/board/lists', {lists}).pipe(
            map(response => response.map(item => new List(item))),
            tap((updatedLists) =>
            {
                // Get the board value
                const board = this._board.value;

                // Go through the updated lists
                updatedLists.forEach((updatedList) =>
                {
                    // Find the index of the updated list
                    const index = board.lists.findIndex(item => item.id === updatedList.id);

                    // Update the list
                    board.lists[index] = updatedList;
                });

                // Sort the board lists
                board.lists.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            }),
        );
    }

    /**
     * Delete the list
     *
     * @param id
     */
    deleteList(list: List): Observable<boolean>
    {

        const params = new HttpParams()
        .set('boardId', list.boardId.toString())
        .set('listId', list.id.toString());

      return this.http.delete<boolean>('http://localhost:8080/api/boards/lists/delete', { params }).pipe(
        tap((isDeleted)=>{
          // Get the board value
          const board = this._board.value;

          // Find the index of the deleted list
          const index = board.lists.findIndex(item => item.id === Number(list.id));

          // Delete the list
          board.lists.splice(index, 1);

          // Sort the board lists
          board.lists.sort((a, b) => a.position - b.position);

          // Update the board
          this._board.next(board);
        }
        )
      );

        // return this._httpClient.delete<boolean>('api/apps/scrumboard/board/list', {params: {id}}).pipe(
        //     tap((isDeleted) =>
        //     {
        //         // Get the board value
        //         const board = this._board.value;

        //         // Find the index of the deleted list
        //         const index = board.lists.findIndex(item => item.id === Number(id));

        //         // Delete the list
        //         board.lists.splice(index, 1);

        //         // Sort the board lists
        //         board.lists.sort((a, b) => a.position - b.position);

        //         // Update the board
        //         this._board.next(board);
        //     }),
        // );
    }

    /**
     * Get card
     */
    getCard(id: number): Observable<Card>
    {
        return this._board.pipe(
            take(1),
            map((board) =>
            {
                console.log(board.lists)
                // Find the card
                const card = board.lists.find(list => list.cards.some(item => item.id === id))
                    .cards.find(item => item.id === id);
                console.log("card " + card)

                // Update the card
                this._card.next(card);

                // Return the card
                return card;
            }),
            switchMap((card) =>
            {
                if ( !card )
                {
                    return throwError('Could not found the card with id of ' + id + '!');
                }

                return of(card);
            }),
        );
    }

    /**
     * Create card
     *
     * @param card
     */
    createCard(card: Card): Observable<Card>
    {
        const apiUrl = 'http://localhost:8080/api/boards'
        const params = new HttpParams()
        .set('boardId', card.boardId)
        .set('listId', card.listId);

    // Make the POST request
    return this.http.post<Card>(`${apiUrl}/cards/add`, card, { params }).pipe(
        map(response => new Card(response)),
        tap((newCard) => {
            const board = this._board.value;

            // Find the list and push the new card in it
            board.lists.forEach((listItem, index, list) =>
            {
                if ( listItem.id === newCard.listId )
                {
                    list[index].cards.push(newCard);
                }
            });

            // Update the board
            this._board.next(board);

            // Return the new card
            return newCard;
        })
    );



        return this._httpClient.put<Card>('api/apps/scrumboard/board/card', {card}).pipe(
            map(response => new Card(response)),
            tap((newCard) =>
            {
                // Get the board value
                const board = this._board.value;

                // Find the list and push the new card in it
                board.lists.forEach((listItem, index, list) =>
                {
                    if ( listItem.id === newCard.listId )
                    {
                        list[index].cards.push(newCard);
                    }
                });

                // Update the board
                this._board.next(board);

                // Return the new card
                return newCard;
            }),
        );
    }

    /**
     * Update the card
     *
     * @param id
     * @param card
     */
    updateCard(id: string, card: Card, boardId: number, listId: number): Observable<Card>
    {

        const url = 'http://localhost:8080/api/boards/cards/update';

    // Set up the request parameters
    let params = new HttpParams();
    params = params.append('boardId', boardId);
    params = params.append('listId', listId);
    params = params.append('cardId', Number(id));

    // Make the POST request
    return this.board$.pipe(
        take(1),
        switchMap(board => this._httpClient.post<Card>(url,card,{
            params,
        }).pipe(
            map((updatedCard)=> {
                 // Find the card and update it
                 board.lists.forEach((listItem) =>
                 {
                     listItem.cards.forEach((cardItem, index, array) =>
                     {
                         if ( cardItem.id === Number(id) )
                         {
                             array[index] = updatedCard;
                         }
                     });
                 });

                 // Update the board
                 this._board.next(board);

                 // Update the card
                 this._card.next(updatedCard);

                 // Return the updated card
                 return updatedCard;
            }
            )
        ))
    )


        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.patch<Card>('api/apps/scrumboard/board/card', {
                id,
                card,
            }).pipe(
                map((updatedCard) =>
                {
                    // Find the card and update it
                    board.lists.forEach((listItem) =>
                    {
                        listItem.cards.forEach((cardItem, index, array) =>
                        {
                            if ( cardItem.id === Number(id) )
                            {
                                array[index] = updatedCard;
                            }
                        });
                    });

                    // Update the board
                    this._board.next(board);

                    // Update the card
                    this._card.next(updatedCard);

                    // Return the updated card
                    return updatedCard;
                }),
            )),
        );
    }

    /**
     * Update the cards
     *
     * @param cards
     */
    updateCards(cards: Card[]): Observable<Card[]>
    {
        return this._httpClient.patch<Card[]>('api/apps/scrumboard/board/cards', {cards}).pipe(
            map(response => response.map(item => new Card(item))),
            tap((updatedCards) =>
            {
                // Get the board value
                const board = this._board.value;

                // Go through the updated cards
                updatedCards.forEach((updatedCard) =>
                {
                    // Find the index of the updated card's list
                    const listIndex = board.lists.findIndex(list => list.id === updatedCard.listId);

                    // Find the index of the updated card
                    const cardIndex = board.lists[listIndex].cards.findIndex(item => item.id === updatedCard.id);

                    // Update the card
                    board.lists[listIndex].cards[cardIndex] = updatedCard;

                    // Sort the cards
                    board.lists[listIndex].cards.sort((a, b) => a.position - b.position);
                });

                // Update the board
                this._board.next(board);
            }),
        );
    }

  
      deleteCardd(boardId: number, listId: number, cardId: number): Observable<boolean> {
        const params = new HttpParams()
            .set('boardId', boardId.toString())
            .set('listId', listId.toString())
            .set('cardId', cardId.toString());

        return this.board$.pipe(
            take(1),
            switchMap(board =>
                this._httpClient.post<boolean>('http://localhost:8080/api/boards/cards/delete', null, { params }).pipe(
                    map((isDeleted: boolean) => {
                        console.log("aici");
                        // Find the card in the specified list and delete it
                        const list = board.lists.find(l => l.id === listId);
                        if (list) {
                            const cardIndex = list.cards.findIndex(c => c.id === cardId);
                            if (cardIndex !== -1) {
                                list.cards.splice(cardIndex, 1);
                            }
                        }

                        // Update the board
                        this._board.next(board);

                        // Clear the current card selection
                        this._card.next(null);

                        // Return the deleted status
                        return isDeleted;
                    }),
                    catchError(error => {
                        console.error("Error in Observable chain:", error);
                        return of(false); // Return an Observable that emits `false`
                    })
                )
            )
        );
    }




    /**
     * Create label
     *
     * @param label
     */
    createLabel(label: Label): Observable<Label>
    {
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.post<Label>('api/apps/scrumboard/board/label', {label}).pipe(
                map((newLabel) =>
                {
                    // Update the board labels with the new label
                    board.labels = [...board.labels, newLabel];

                    // Update the board
                    this._board.next(board);

                    // Return new label from observable
                    return newLabel;
                }),
            )),
        );
    }

    /**
     * Update the label
     *
     * @param id
     * @param label
     */
    updateLabel(id: string, label: Label): Observable<Label>
    {
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.patch<Label>('api/apps/scrumboard/board/label', {
                id,
                label,
            }).pipe(
                map((updatedLabel) =>
                {
                    // Find the index of the updated label
                    const index = board.labels.findIndex(item => item.id === id);

                    // Update the label
                    board.labels[index] = updatedLabel;

                    // Update the board
                    this._board.next(board);

                    // Return the updated label
                    return updatedLabel;
                }),
            )),
        );
    }

    /**
     * Delete the label
     *
     * @param id
     */
    deleteLabel(id: string): Observable<boolean>
    {
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.delete('api/apps/scrumboard/board/label', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted label
                    const index = board.labels.findIndex(item => item.id === id);

                    // Delete the label
                    board.labels.splice(index, 1);

                    // If the label is deleted...
                    if ( isDeleted )
                    {
                        // Remove the label from any card that uses it
                        board.lists.forEach((list) =>
                        {
                            list.cards.forEach((card) =>
                            {
                                const labelIndex = card.labels.findIndex(label => label.id === id);
                                if ( labelIndex > -1 )
                                {
                                    card.labels.splice(labelIndex, 1);
                                }
                            });
                        });
                    }

                    // Update the board
                    this._board.next(board);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }

    /**
     * Search within board cards
     *
     * @param query
     */
    search(query: string): Observable<Card[] | null>
    {
        // @TODO: Update the board cards based on the search results
        return this._httpClient.get<Card[] | null>('api/apps/scrumboard/board/search', {params: {query}});
    }
}
