import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Leaderboards, ContestScore } from '../models/leaderboards.model';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl+'floatVotingManagment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class FloatService {

  constructor(private httpClient: HttpClient) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = 'An error occurred:'+error.error.message;
    } else {
      // server-side error
      errorMessage = error.error.message;
    }

    return throwError(() => {
      return errorMessage;
    });
  }

  insertVote(data: string): Observable<any[]> {
    return this.httpClient.post<any[]>(API_URL+'/addNewVote', data, httpOptions)
    .pipe(
     catchError(this.handleError)
    )
  }

}
