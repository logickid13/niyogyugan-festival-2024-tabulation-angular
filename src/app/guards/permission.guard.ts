import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticateService } from '../services/authenticate.service';
import { Observable, map } from 'rxjs';

export const permissionGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  return authService.accountPermissionOb().pipe(
    map(res => {
      let account_permission: number[] = res;
      switch(route.path) {  
        case "home":
          if (account_permission.includes(1.03)) {
            return true;
          } else {
            router.navigate(['/login']);
          }
        break;
        case "activity-logs":
          if (account_permission.includes(2)) {
            return true;
          } else {
            router.navigate(['/login']);
          }
        break;
        case "accounts":
          if (account_permission.includes(3)) {
            return true;
          } else {
            router.navigate(['/login']);
          }
        break;
        case "scoring":
          if (account_permission.includes(4)) {
            return true;
          } else {
            router.navigate(['/login']);
          }
        break;
        case "consolation":
          if (account_permission.includes(5)) {
            return true;
          } else {
            router.navigate(['/login']);
          }
        break;
      }

      return false;
    })
  );
}
