import { 
  HttpInterceptorFn, 
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { inject } from '@angular/core';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenExtractor = inject(HttpXsrfTokenExtractor);

  const cookieheaderName = 'x-csrf-token';

  let csrfToken = tokenExtractor.getToken() as string;
  if (csrfToken !== null && !req.headers.has(cookieheaderName)) {
		req = req.clone({ headers: req.headers.set(cookieheaderName, csrfToken) });
	}
  return next(req);
};
