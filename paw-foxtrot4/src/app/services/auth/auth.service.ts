import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  dummy = new Subject<any>();


  login(email: string, password: string): Observable<any> {

    //TODO: fill log in api endpoint
    let url = this.apiUrl + '/login';

    let data = {
      email: email,
      password: password,
    };

    if (environment.production) {
      return this.http.post<[]>(url, data)
        .pipe(
          tap(_ => this.log('brr logging in ...')),
          catchError(this.handleError<[]>('login ' + url, []))
        );
    } else {
      setTimeout(()=>this.dummy.next(true), 1000);
      return this.dummy.asObservable();
    }





  }



  signin(email: string, first: string, last: string, password: string): Observable<any> {

    //TODO: fill sing in api endpoint
    let url = this.apiUrl + '/signin';

    let data = {
      email: email,
      firstName: first,
      lastName: last,
      password: password,

    };

    if (environment.production) {
      return this.http.post<[]>(url, data)
        .pipe(
          tap(_ => this.log('brr signing in ...')),
          catchError(this.handleError<[]>('signin ' + url, []))
        );
    } else {

      setTimeout(()=>this.dummy.next(true), 1000);
      return this.dummy.asObservable();

    }

  }




  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(`AuthService > ${message}`);
  }
}
