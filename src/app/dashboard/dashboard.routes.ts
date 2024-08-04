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
            },
            {
                path: 'scoring',
                loadComponent: () => import('../dashboard/scoring/scoring.component').then(m => m.ScoringComponent),
                canMatch: [permissionGuard]
            },
            {
                path: 'consolation',
                loadComponent: () => import('../dashboard/consolation/consolation.component').then(m => m.ConsolationComponent),
                canMatch: [permissionGuard]
            },
            {
                path: 'activity-logs',
                loadComponent: () => import('../dashboard/activity-logs/activity-logs.component').then(m => m.ActivityLogsComponent),
                canMatch: [permissionGuard]
            }
        ]
    }
];