import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableParameters, UserPermission, NewAccount, UpdateBasicInfo, UpdatePassword, UnlockAccount } from '../models/account.model';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

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

  loadAccount(tableParams: TableParameters): Observable<TableParameters> {
    return this.httpClient.post<TableParameters>(API_URL+'accounts/load', tableParams, httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  loadPermission(): Observable<UserPermission[]> {
    return this.httpClient.get<UserPermission[]>(API_URL+'files/permissions.json', httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  newAccountnoProfilePic(newAccountData: NewAccount[]): Observable<NewAccount[]> {
    return this.httpClient.post<NewAccount[]>(API_URL+'accounts/newAccountnoProfilePic', newAccountData, httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

  newAccountWithProfilePic(formData: any): Observable<any> {
      return this.httpClient.post<any>(API_URL+'accounts/newAccountWithProfilePic', formData)
    .pipe(
      catchError(this.handleError)
    )
  }

}
