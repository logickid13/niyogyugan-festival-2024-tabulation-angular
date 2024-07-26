import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../app/nested-container/nested-container.routes').then(m => m.NESTED_CONTAINER_ROUTES)
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        loadChildren: () => import('../app/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
