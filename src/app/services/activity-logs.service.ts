import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableParameters, UsersListAutocomplete } from '../models/activity-logs.model';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class ActivityLogsService {

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

  loadHistory(tableParams: TableParameters): Observable<TableParameters> {
    return this.httpClient.post<TableParameters>(API_URL+'activitylogs/load', tableParams, httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  loadUsersAutocomplete(): Observable<UsersListAutocomplete[]> {
      return this.httpClient.get<UsersListAutocomplete[]>(API_URL+'activitylogs/loadUsersAutoComplete', httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }
}
