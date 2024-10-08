import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { permissionGuard } from '../guards/permission.guard';
import { FloatComponent } from './float/float.component';

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
            },
            {
                path: 'accounts',
                loadComponent: () => import('../dashboard/accounts/accounts.component').then(m => m.AccountsComponent),
                canMatch: [permissionGuard]
            },
            {
                path: 'float',
                loadComponent: () => import('../dashboard/float/float.component').then(m => m.FloatComponent),
                children:[
                    {
                        path: 'current-ranking',
                        loadComponent: () => import('../dashboard/float-current-standing-report/float-current-standing-report.component').then(m => m.FloatCurrentStandingReportComponent),
                        canMatch: [permissionGuard]
                    },
                    {
                        path: 'list-of-voters',
                        loadComponent: () => import('../dashboard/float-list-of-voters-of-selected-town/float-list-of-voters-of-selected-town.component').then(m => m.FloatListOfVotersOfSelectedTownComponent),
                        canMatch: [permissionGuard]
                    }
                ],
                canMatch: [permissionGuard]
            }
        ]
    }
];