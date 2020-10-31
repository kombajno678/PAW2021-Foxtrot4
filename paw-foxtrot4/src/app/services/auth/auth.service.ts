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

  dummy = new Subject<any>();

  userStorageKey:string = 'user';

  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;



  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(this.userStorageKey)));
    this.user = this.userSubject.asObservable();
  }

 
  


  logout(){
    localStorage.removeItem(this.userStorageKey);
    //TODO: remove token


    this.userSubject.next(null);

  }

  login(email: string, password: string): Observable<any> {

    //TODO: fill log in api endpoint
    let url = this.apiUrl + '/login';

    let data = {
      email: email,
      password: password,
    };

    if (environment.production) {
      return this.http.post<any>(url, data)
        .pipe(
          tap(_ => this.log('brr logging in ...')),
          map(d => {
            //if login successful
            //TODO: save token here
            localStorage.removeItem(this.userStorageKey);
            localStorage.setItem(this.userStorageKey, JSON.stringify(d));
            this.userSubject.next(d);
            return d;

          }), 
          catchError(this.handleError<any>('login ' + url, null))
        );
    } else {
      setTimeout(()=>this.dummy.next(true), 500);
      localStorage.removeItem(this.userStorageKey);
      localStorage.setItem(this.userStorageKey, JSON.stringify(data));
      this.userSubject.next(data);
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
          map(d => {
            //if signin->login successful
            //TODO: save token here
            localStorage.setItem(this.userStorageKey, JSON.stringify(d));
            this.userSubject.next(d);

          }), 
          catchError(this.handleError<[]>('signin ' + url, []))
        );
    } else {

      setTimeout(()=>this.dummy.next(true), 500);
      localStorage.setItem(this.userStorageKey, JSON.stringify(data));
      this.userSubject.next(data);

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
