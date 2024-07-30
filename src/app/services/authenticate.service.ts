import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { Login, BackendSessionCheck, UpdatePassword, RefreshToken, RefreshTokenExpired, Logout } from '../models/login.model';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private isLogged =  new BehaviorSubject<boolean>(false); // for use in router guard
	public  isLoggedInStatus =  this.isLogged; // for use in router guard

	private sessionUID = new BehaviorSubject<string>(''); // for use in account session uid
	public sessionUIDVal = this.sessionUID; // for use in account session uid

	private profilePIC = new BehaviorSubject<string>('');
	public profilePICVal = this.profilePIC;

	private accountPermission = new BehaviorSubject<[]>([]);
	public accountPermissionVal = this.accountPermission;

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error
    });
  }

  isLoggedSubject(): Observable<boolean> {
    return this.isLoggedInStatus;
  }

  sessionUIDOb(): Observable<string> {
    return this.sessionUIDVal;
  }

  accountPermissionOb(): Observable<[]> {
    return this.accountPermissionVal;
  }

  backendSessionCheck(): Observable<BackendSessionCheck[]> {
    return this.httpClient.get<BackendSessionCheck[]>(API_URL+'auth/sessionCheck', httpOptions)
    .pipe(
      tap((res: BackendSessionCheck[]) => {
        if (res[0].status == 'currently_logged_in') {
          this.isLogged.next(true);
          this.jwtService.saveAccessToken(res[0].access_token); // save to local storage (Access Token)
          this.jwtService.saveRefreshToken(res[0].refresh_token); // save to local storage (Refresh Token)
          this.sessionUID.next(res[0].uid);
          this.profilePIC.next(res[0].profile_pic);
          this.accountPermission.next(JSON.parse(res[0].permission));
        }
      }),
      catchError(this.handleError)
    )
  }

  isLoggedIn(): Observable<any> {
    return this.httpClient.get<any>(API_URL+'auth/isLoggedIn', httpOptions)
    .pipe(catchError(this.handleError))
  }

  login(loginDatatoServer: Login): Observable<Login> {

    return this.httpClient.post<Login>(API_URL+'auth/login', loginDatatoServer, httpOptions)
      .pipe(
        tap((res: Login) => {
          if (res[0].status == 'password_fail' || 
              res[0].status == 'username_not_exist' ||
              res[0].status == 'invalid_transaction'
          ) {

            this.isLogged.next(false);
            this.sessionUID.next('');
            this.profilePIC.next('');
            this.profilePIC.next('');
            this.accountPermission.next([]);

          } else if (res[0].status == 'logged_in') {

            this.jwtService.saveAccessToken(res[0].access_token); // save to local storage (Access Token)
            this.jwtService.saveRefreshToken(res[0].refresh_token); // save to local storage (Refresh Token)
            this.isLogged.next(true);
            this.sessionUID.next(res[0].uid);
            this.profilePIC.next(res[0].profile_pic);
            this.accountPermission.next(JSON.parse(res[0].permission));
          }

        }),
        catchError(this.handleError)
      )
  }

  updatePassword(changePasswordtoServer: UpdatePassword): Observable<UpdatePassword> {
    return this.httpClient.post<UpdatePassword>(API_URL+'auth/updatePassword', changePasswordtoServer, httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  refreshToken(token: string) {
    return this.httpClient.post<RefreshToken[]>(API_URL+'auth/refreshToken', { 'refresh_token':token }, httpOptions)
  }

  refreshTokenExpired(): Observable<RefreshTokenExpired[]> {
    return this.httpClient.get<RefreshTokenExpired[]>(API_URL+'auth/refreshTokenExpire', httpOptions)
    .pipe(
        tap((res: any) => {
          this.jwtService.signOut(); // clear local storage
          this.isLogged.next(false);
          this.sessionUID.next('');
          this.profilePIC.next('');
          this.accountPermission.next([]);
        }),
        catchError(this.handleError)
      )
  }

  updateProfilePicture(formData: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+'auth/updateProfilePic', formData)
    .pipe(
      catchError(this.handleError)
    )
  } 

  logout() {
  // remove user from local storage to log user out
    return this.httpClient.post<Logout>(API_URL+'auth/logout', { 'grant_type': 'logout' }, httpOptions)
    .pipe(
      tap((res: Logout) => {
        this.jwtService.signOut(); // clear local storage
        this.isLogged.next(false);
        this.sessionUID.next('');
        this.profilePIC.next('');
        this.accountPermission.next([]);
      }),
      catchError(this.handleError)
    )
  }

}
