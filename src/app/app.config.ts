import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withXsrfConfiguration, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { csrfInterceptor } from './interceptors/csrf.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(
      withInterceptors(
        [
          jwtInterceptor,
          csrfInterceptor
        ]
      ),
      withXsrfConfiguration(
        {
          cookieName: 'XSRF-TOKEN',
          headerName: 'x-csrf-token'
        }
      )
    ),
    provideAnimationsAsync(),
    provideToastr(),
    importProvidersFrom(LoadingBarHttpClientModule), provideCharts(withDefaultRegisterables())
  ]
};
