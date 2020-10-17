import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {

  }




  get():Observable<[]>{
    /*
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
*/
    let url = this.apiUrl + '/skeleton/get';

    return this.http.get<[]>(url)
    .pipe(
      tap(_ => this.log('brr service working')),
      catchError(this.handleError<[]>('get ' + url, []))
    );

  }

  put(objects:any[]){
    console.log(objects);
    let url = this.apiUrl + '/skeleton/put';

    return this.http.post<[]>(url, objects)
    .pipe(
      tap(_ => this.log('brr service working')),
      catchError(this.handleError<[]>('post ' + url, []))
    );
  }

  
  delete(objects:any[]){
    console.log(objects);
    let url = this.apiUrl + '/skeleton/delete';

    return this.http.post<[]>(url, objects)
    .pipe(
      tap(_ => this.log('brr service working')),
      catchError(this.handleError<[]>('post ' + url, []))
    );
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
    console.log(`AccountService > ${message}`);
  }









}
