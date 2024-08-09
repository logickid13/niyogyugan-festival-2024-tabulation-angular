import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { News } from '../models/news.model';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class NewsService {

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


  loadNews(): Observable<News[]> {
    return this.httpClient.get<News[]>(API_URL+'news/load', httpOptions)
   .pipe(
     catchError(this.handleError)
   )
  }

}
