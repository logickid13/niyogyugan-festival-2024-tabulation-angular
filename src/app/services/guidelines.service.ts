import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Guidelines } from '../models/guidelines.model';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class GuidelinesService {

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

  loadGuidelines(): Observable<Guidelines[]> {
    return this.httpClient.get<Guidelines[]>(API_URL+'guidelines/loadGuidelines', httpOptions)
    .pipe(
     catchError(this.handleError)
    )
  }

  getFileAsBlob(guideline_link: string) {
    return this.httpClient.get(guideline_link, { responseType: 'blob' })
    .pipe(
     catchError(this.handleError)
    )
  }
}
