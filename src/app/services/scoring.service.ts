import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Municipalities, Contests, GetCurrentScore, CurrentScoreToBeSent } from '../models/scoring.model';
import { environment } from '../../environments/environment.development';
import { forkJoin } from 'rxjs';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  constructor(private httpClient: HttpClient) {}

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

  loadMunicipalities(): Observable<Municipalities[]> {
    return this.httpClient.get<Municipalities[]>(API_URL+'scoring/loadMunicipality', httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  loadContests(): Observable<Contests[]> {
    return this.httpClient.get<Contests[]>(API_URL+'scoring/loadContest', httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  loadReferences(): Observable<any[]> {
    return forkJoin([
      this.loadMunicipalities(),
      this.loadContests()
    ])
  }

  getCurrentScore(param: GetCurrentScore): Observable<GetCurrentScore> {
    return this.httpClient.post<GetCurrentScore>(API_URL+'scoring/getCurrentScore', param, httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  addToCurrentScore(param: CurrentScoreToBeSent): Observable<CurrentScoreToBeSent> {
    return this.httpClient.post<CurrentScoreToBeSent>(API_URL+'scoring/addToCurrentScore', param, httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  updateCurrentScore(param: CurrentScoreToBeSent): Observable<CurrentScoreToBeSent> {
    return this.httpClient.post<CurrentScoreToBeSent>(API_URL+'scoring/updateCurrentScore', param, httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

}
