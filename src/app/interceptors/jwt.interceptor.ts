import { 
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse, 
  HttpEvent,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, map, tap, filter, take } from 'rxjs/operators';
import { AuthenticateService } from '../services/authenticate.service';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenExpired } from '../models/login.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

const API_URL = environment.apiUrl;
const TOKEN_HEADER_KEY = 'Authorization';

export const jwtInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {

  let isRefreshing = false;
  let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  const authService = inject(AuthenticateService);
  const jwtService = inject(JwtService);
  const router = inject(Router);
  
  let authReq = req;

  const token = jwtService.getAccessToken();

  if (token != null) {
    authReq = addTokenHeader(req, token);
  } else {
    authReq = excludeTokenHeader(req);
  }

  const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn) => { 
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      const token = jwtService.getRefreshToken();

      return authService.refreshToken(String(token)).pipe(
				switchMap(token => {
					isRefreshing = false;
					// this.jwtService.removeAccessToken();

					jwtService.saveAccessToken(token[0].access_token);

					return next(addTokenHeader(request, token[0].access_token));
				}),
				catchError((err) => {

					if (err.status == 403) {

						authService.refreshTokenExpired().subscribe({
							next: (res: RefreshTokenExpired[]) => {
								if (res[0].status == 'refresh_token_expired') {
									isRefreshing = false;

									// this.toastrService.error('You are logged out.', 'Forbidden Access', {
									// 	progressBar: true,
									// 	timeOut: 2000
									// });

									const skippedUrls:string[] = [API_URL+"auth/isLoggedIn"];

									if (skippedUrls.includes(request.url)) {
										// do nothing
									} else {
										router.navigate(['/login']); // redirect to the route you want to go...
									}
								}
							},
							error: (err) => {
								// this.toastrService.error('Invalid Transaction', '', {
								// 	progressBar: true,
								// 	timeOut: 2000
								// });
								return throwError(() => err);
							}
						});

					}

					return throwError(() => err);
				})
			)

    }

    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addTokenHeader(request, token)))
    );
  };

  

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq, next);
      }
			return throwError(() => error);
    })
  )
  
};


export const addTokenHeader = (req: HttpRequest<any>, token: string) => {
  return req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
};

export const excludeTokenHeader = (req: HttpRequest<any>) => {
  return req.clone();
};