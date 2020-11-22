import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Board } from 'src/app/models/Board';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { BoardList } from 'src/app/models/BoardList';
import { ListCard } from 'src/app/models/ListCard';
@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  private apiUrl = environment.apiUrl;

  boardsPath: string;


  constructor(private http: HttpClient) {
    this.boardsPath = this.apiUrl + '/boards';
    this.allBoards = new BehaviorSubject<Board[]>(null);
    this.updateBoards();

  }


  allBoards: BehaviorSubject<Board[]>



  updateBoards() {


    this.http.get<Board[]>(this.boardsPath)
      .pipe(
        tap(_ => this.log('retreived boards, count : ' + _.length)),
        catchError(this.handleError<Board[]>('getBoards ' + this.boardsPath, []))
      ).subscribe(r => {
        this.allBoards.next(r);
      })

  }


  getBoards(): Observable<Board[]> {
    return this.allBoards.asObservable();
  }

  getBoard(id: number): Observable<Board> {

    // TODO: get only single board, but api is not ready yet

    return this.http.get<Board[]>(this.boardsPath)
      .pipe(
        tap(_ => this.log('retreived board')),
        map(boards => boards.find(b => b.id == id)),
        catchError(this.handleError<Board>('getBoard ' + this.boardsPath, null))
      );
  }

  addBoard(board: Board): Observable<Board> {

    let url = this.boardsPath + '/add';

    return this.http.post<Board>(url, board)
      .pipe(
        tap(_ => {
          this.log('addBoard result : ' + JSON.stringify(_));
          this.updateBoards();
        }),
        catchError(this.handleError<Board>('addBoard ' + url, null))
      );
  }


  archiveBoard(board: Board): Observable<Board> {

    let url = this.boardsPath + '/archive';

    return this.http.post<any>(url, board)
      .pipe(
        tap(_ => {
          this.log('archiveBoard result : ' + JSON.stringify(_));
          this.updateBoards();
        }),
        map(result => {
          board.archived = true;
          return board;
        }),
        catchError(this.handleError<Board>('archiveBoard ' + url, null))
      );
  }


  restoreBoard(board: Board): Observable<Board> {

    let url = this.boardsPath + '/restore';

    return this.http.post<any>(url, board)
      .pipe(
        tap(_ => {
          this.log('restoreBoard result : ' + JSON.stringify(_));
          this.updateBoards();
        }),
        map(result => {
          board.archived = false;
          return board;
        }),
        catchError(this.handleError<Board>('restoreBoard ' + url, null))
      );
  }

  updateBoard(board: Board): Observable<Board> {


    return this.http.put<Board>(this.boardsPath, board).pipe(
      tap(_ => {
        this.log('updateBoard result : ' + JSON.stringify(_));
        this.updateBoards();
      })
    )

  }


  deleteBoard(board: Board): Observable<Board> {

    // TODO: api not ready yet

    let dummy = new Subject<any>();

    dummy.next(false);
    return dummy.asObservable();
  }


















  //=============================================================





  getLists(board: Board): Observable<BoardList[]> {
    let url = this.apiUrl + `/boards/${board.id}/lists`;

    return this.http.get<BoardList[]>(url)
      .pipe(
        tap(_ => this.log('getLists result : ' + JSON.stringify(_))),
        catchError(this.handleError<BoardList[]>('getLists ' + url, null))
      );
  }

  getList(board: Board, listId: number): Observable<BoardList> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${listId}`;

    return this.http.get<BoardList>(url)
      .pipe(
        tap(_ => this.log('getList result : ' + JSON.stringify(_))),
        catchError(this.handleError<BoardList>('getList ' + url, null))
      );
  }
  addList(board: Board, listName: string): Observable<BoardList> {

    let url = this.apiUrl + `/boards/${board.id}/lists/add`;

    let temp = new BoardList(listName, board.lists ? board.lists.length + 1 : 1);

    return this.http.post<BoardList>(url, temp)
      .pipe(
        tap(_ => this.log('addList result : ' + JSON.stringify(_))),
        catchError(this.handleError<BoardList>('addList ' + url, null))
      );

  }

  archiveList(board: Board, list: BoardList): Observable<BoardList> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/archive`;

    return this.http.post<BoardList>(url, list)
      .pipe(
        tap(_ => this.log('archiveList result : ' + JSON.stringify(_))),
        map(result => {
          list.archived = true;
          return list;
        }),
        catchError(this.handleError<BoardList>('archiveList ' + url, null))
      );

  }

  restoreList(board: Board, list: BoardList): Observable<BoardList> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/restore`;

    return this.http.post<BoardList>(url, list)
      .pipe(
        tap(_ => this.log('restoreList result : ' + JSON.stringify(_))),
        map(result => {
          list.archived = false;
          return list;
        }),
        catchError(this.handleError<BoardList>('restoreList ' + url, null))
      );

  }

  deleteList(board: Board, list: BoardList): Observable<any> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}`;

    return this.http.delete<any>(url)
      .pipe(
        tap(_ => this.log('deleteList result : ' + JSON.stringify(_))),
        catchError(this.handleError<any>('deleteList ' + url, null))
      );
  }

  updateListPosition() {
    //api not ready
    return null;
  }

  addCard(board: Board, list: BoardList, card_name: string): Observable<ListCard> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/cards/add`;

    let temp = new ListCard(card_name, '', list.cards ? list.cards.length + 1 : 1);
    //temp.list_id = list.id;

    return this.http.post<ListCard>(url, temp)
      .pipe(
        tap(_ => this.log('addCard result : ' + JSON.stringify(_))),
        catchError(this.handleError<ListCard>('addCard ' + url, null))
      );

  }

  getCards(board: Board, list: BoardList): Observable<ListCard[]> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/cards`;

    return this.http.get<ListCard[]>(url)
      .pipe(
        tap(_ => this.log('getCards result : ' + JSON.stringify(_))),
        catchError(this.handleError<ListCard[]>('getCards ' + url, null))
      );


  }

  getCard(board: Board, list: BoardList, cardId: number): Observable<ListCard> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/cards/${cardId}`;

    return this.http.get<ListCard>(url)
      .pipe(
        tap(_ => this.log('gatCard result : ' + JSON.stringify(_))),
        catchError(this.handleError<ListCard>('gatCard ' + url, null))
      );

  }

  deleteCard(board: Board, list: BoardList, card: ListCard): Observable<any> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/cards/${card.id}`;

    return this.http.delete<any>(url)
      .pipe(
        tap(_ => this.log('deleteCard result : ' + JSON.stringify(_))),
        catchError(this.handleError<any>('deleteCard ' + url, null))
      );
  }

  archiveCard(board: Board, list: BoardList, card: ListCard): Observable<ListCard> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/cards/${card.id}/archive`;

    return this.http.post<any>(url, card.id)
      .pipe(
        tap(_ => this.log('archiveCard result : ' + JSON.stringify(_))),
        map(result => {
          card.archived = false;
          return card;
        }),
        catchError(this.handleError<any>('archiveCard ' + url, null))
      );
  }

  restoreCard(board: Board, list: BoardList, card: ListCard): Observable<ListCard> {
    let url = this.apiUrl + `/boards/${board.id}/lists/${list.id}/cards/${card.id}/restore`;

    return this.http.post<any>(url, card.id)
      .pipe(
        tap(_ => this.log('restoreCard result : ' + JSON.stringify(_))),
        map(result => {
          card.archived = false;
          return card;
        }),
        catchError(this.handleError<any>('restoreCard ' + url, null))
      );
  }

  updateCardPosition() {
    //api not ready
    return null;
  }




  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}, result: \"${result}\"`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(`BoardsService > ${message}`);
  }
}
