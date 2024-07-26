import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { permissionGuard } from '../guards/permission.guard';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('../dashboard/home/home.component').then(m => m.HomeComponent),
                canMatch: [permissionGuard]
            }
        ]
    }
];