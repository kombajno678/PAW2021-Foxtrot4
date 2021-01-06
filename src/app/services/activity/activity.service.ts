import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Activity } from 'src/app/models/Activity';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Board } from 'src/app/models/Board';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl = environment.apiUrl;

  resourcePath: string = '/activities';


  public activities$: BehaviorSubject<Activity[]> = new BehaviorSubject(null);
  public activities: Activity[] = null;

  private test: boolean = false;//true;



  constructor(private http: HttpClient) { }

  refreshResource(boardId: number = null) {
    this.http.get<Activity[]>(this.apiUrl + this.resourcePath + (boardId ? '/board/' + boardId : ''))
      .pipe(
        tap(_ => this.log('retreived activities, count : ' + _.length)),
        catchError(this.handleError<Activity[]>(this.apiUrl + this.resourcePath, null))
      ).subscribe(r => {
        this.activities$.next(r);
      })
  }

  getAll(boardId: number = null, forceRefresh:boolean = false): Observable<Activity[]> {

    if (forceRefresh || (!this.activities || this.activities.length == 0)) {
      this.refreshResource(boardId);
    }
    return this.activities$.asObservable();

  }

  create(newActivity: Activity): Observable<Activity> {
    let result: Subject<any> = new Subject();

    newActivity.id = null;
    newActivity.user_id = null;


    if (this.test) {
      if (!this.activities) {
        this.activities = [];
      }
      newActivity.id = this.activities.length + 1;
      this.activities.push(newActivity);
      this.activities$.next(this.activities);
      result.next(newActivity);
    } else {
      this.http.post<Activity>(this.apiUrl + this.resourcePath + '/add', newActivity)
        .pipe(
          tap(_ => this.log('created activity')),
          catchError(this.handleError<Activity>(this.apiUrl + this.resourcePath, null))
        ).subscribe(r => {
          console.log('activity result = ', newActivity, r);
          result.next(r);
        });
    }



    return result.asObservable();
  }




  /*
    update(activity:Activity):Observable<Activity>{
      return this.http.put<Activity>(this.apiUrl + this.resourcePath, activity)
      .pipe(
        tap(_ => this.log('updated activity')),
        catchError(this.handleError<Activity>(this.apiUrl + this.resourcePath, null))
      )
    }
  
    remove(activity:Activity):Observable<Activity>{
      return this.http.delete<Activity>(this.apiUrl + this.resourcePath + '/' + activity.id)
      .pipe(
        tap(_ => this.log('deleted activity')),
        catchError(this.handleError<Activity>(this.apiUrl + this.resourcePath, null))
      )
    }
  
  */



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
