import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;
  path = this.apiUrl + '/users';
  private usersubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.usersubject = new BehaviorSubject<User>(null);
    this.refresh();
  }

  refresh() {
    this.http.get<any>(this.path).subscribe(r => {
      this.usersubject.next(r);
    })
  }

  get(): Observable<User> {
    return this.usersubject.asObservable();
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(this.path, user).pipe(
      tap(r => this.usersubject.next(r)),
      catchError(this.handleError<User>(this.path, null))
    )
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
