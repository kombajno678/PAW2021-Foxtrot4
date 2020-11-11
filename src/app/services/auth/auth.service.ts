import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConditionalExpr } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  private prod: boolean = true;//true -> use api, false -> use dummy
  dummy = new Subject<any>();

  userStorageKey: string = 'user';
  refreshStorageKey: string = 'refresh';

  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;



  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(localStorage.getItem(this.userStorageKey));
    this.user = this.userSubject.asObservable();
  }





  logout() {
    localStorage.removeItem(this.userStorageKey);
    //TODO: remove token
    this.userSubject.next(null);

    /*

    let url = this.apiUrl + '/auth/logout';

    return this.http.get<any>(url)
        .pipe(
          tap(_ => this.log('brr logging in ...')),
          map(d => {
            //if login successful
            //TODO: save token here
            localStorage.removeItem(this.userStorageKey);
            localStorage.setItem(this.userStorageKey, d.accessToken);
            this.userSubject.next(d.accessToken);
            return true;

          }), 
          catchError(this.handleError<any>('login ' + url, null))
        );

        */

  }

  login(login: string, password: string): Observable<any> {

    //TODO: fill log in api endpoint
    let url = this.apiUrl + '/auth/login';

    let data = {
      login: login,
      password: password,
    };

    if (environment.production || this.prod) {
      return this.http.post<any>(url, data)
        .pipe(
          tap(_ => this.log('brr logging in ...')),
          map(d => {
            //if login successful


            localStorage.removeItem(this.userStorageKey);
            localStorage.setItem(this.userStorageKey, d.accessToken);

            localStorage.removeItem(this.refreshStorageKey);
            localStorage.setItem(this.refreshStorageKey, d.refreshToken);


            this.userSubject.next(d.accessToken);
            return true;

          }),
          catchError(this.handleError<any>('login ' + url, null))
        );
    } else {
      setTimeout(() => this.dummy.next(true), 500);
      localStorage.removeItem(this.userStorageKey);
      localStorage.setItem(this.userStorageKey, JSON.stringify(data));
      this.userSubject.next(data);
      return this.dummy.asObservable();
    }
  }



  signin(login: string, email: string, first: string, last: string, password: string): Observable<any> {

    //TODO: fill sing in api endpoint
    let url = this.apiUrl + '/auth/register';

    let data = {
      login: login,
      email: email,
      first_name: first,
      last_name: last,
      password: password,

    };

    if (environment.production || this.prod) {
      return this.http.post<any>(url, data)
        .pipe(
          tap(_ => this.log('brr signing in ...')),
          catchError(this.handleError<any>('signin ' + url, null))
        );
    } else {
      console.log('signin test mode');
      this.userSubject.next('OK');

      return this.dummy.asObservable();

    }

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
    console.log(`AuthService > ${message}`);
  }
}
