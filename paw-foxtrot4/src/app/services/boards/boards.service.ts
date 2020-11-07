import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Board } from 'src/app/models/Board';
import { Observable, of, Subject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }


  getBoards(): Observable<Board[]> {

    let url = this.apiUrl + '/boards';

    return this.http.get<Board[]>(url)
      .pipe(
        tap(_ => this.log('retreived boards, count : ' + _.length)),
        catchError(this.handleError<Board[]>('getBoards ' + url, []))
      );


  }

  getBoard(id: number): Observable<Board> {

    // TODO: get only single board, but api is not ready yet

    let url = this.apiUrl + '/boards';

    return this.http.get<Board[]>(url)
      .pipe(
        tap(_ => this.log('retreived board')),
        map(boards => boards.find(b => b.id == id)),
        catchError(this.handleError<Board>('getBoard ' + url, null))
      );
  }

  addBoard(board: Board): Observable<Board> {

    let url = this.apiUrl + '/boards/add';

    return this.http.post<Board>(url, board)
      .pipe(
        tap(_ => this.log('addBoard result : ' + JSON.stringify(_))),
        catchError(this.handleError<Board>('addBoard ' + url, null))
      );
  }


  archiveBoard(board: Board): Observable<Board> {

    let url = this.apiUrl + '/boards/archive';

    return this.http.post<any>(url, board)
      .pipe(
        tap(_ => this.log('archiveBoard result : ' + JSON.stringify(_))),
        map(result => {
          board.archived = true;
          return board;
        }),
        catchError(this.handleError<Board>('archiveBoard ' + url, null))
      );
  }


  restoreBoard(board: Board): Observable<Board> {

    let url = this.apiUrl + '/boards/restore';

    return this.http.post<any>(url, board)
      .pipe(
        tap(_ => this.log('restoreBoard result : ' + JSON.stringify(_))),
        map(result => {
          board.archived = false;
          return board;
        }),
        catchError(this.handleError<Board>('restoreBoard ' + url, null))
      );
  }


  deleteBoard(board: Board): Observable<Board> {

    // TODO: api not ready yet

    let dummy = new Subject<any>();

    dummy.next(false);
    return dummy.asObservable();
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
