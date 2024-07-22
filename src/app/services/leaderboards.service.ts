import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Leaderboards, ContestScore } from '../models/leaderboards.model';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class LeaderboardsService {

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

  loadLeaderboard(): Observable<Leaderboards[]> {
    return this.httpClient.get<Leaderboards[]>(API_URL+'api/leaderboards/load', httpOptions)
    .pipe(
     catchError(this.handleError)
    )
  }

  getContestResult(s_munic: string): Observable<ContestScore[]> {
    return this.httpClient.post<ContestScore[]>(API_URL+'api/leaderboards/loadContestResultsPerMunicipality', { munic_id: s_munic }, httpOptions)
    .pipe(
     catchError(this.handleError)
    )
  }
}
