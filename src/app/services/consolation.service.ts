import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Municipalities, Contests, UpdateConsolationFinalScores } from '../models/consolation.model';
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
export class ConsolationService {

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
    return this.httpClient.get<Municipalities[]>(API_URL+'consolation/loadMunicipality', httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  loadContests(): Observable<Contests[]> {
    return this.httpClient.get<Contests[]>(API_URL+'consolation/loadContest', httpOptions)
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

  updateConsolationScores(param: UpdateConsolationFinalScores): Observable<UpdateConsolationFinalScores> {
    return this.httpClient.post<UpdateConsolationFinalScores>(API_URL+'consolation/updateConsolationScore', param, httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }


}
