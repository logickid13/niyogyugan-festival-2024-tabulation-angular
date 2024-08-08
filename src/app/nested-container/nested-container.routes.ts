import { Routes } from '@angular/router';
import { NestedContainerComponent } from './nested-container.component';

export const NESTED_CONTAINER_ROUTES: Routes = [
    {
        path: "",
        component: NestedContainerComponent,
        children: [
            {
                path: "",
                redirectTo: "/schedule",
                pathMatch: "full"
            },
            {
                path: "about",
                loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
            },
            {
                path: "activities",
                loadComponent: () => import('./activities/activities.component').then(m => m.ActivitiesComponent)
            },
            {
                path: "guidelines",
                loadComponent: () => import('./guidelines/guidelines.component').then(m => m.GuidelinesComponent)
            },
            {
                path: "leaderboard",
                loadComponent: () => import('./overall-ranking/overall-ranking.component').then(m => m.OverallRankingComponent)
            },
            {
                path: "schedule",
                loadComponent: () => import('./schedule/schedule.component').then(m => m.ScheduleComponent)
            },
            {
                path: "news",
                loadComponent: () => import('./news/news.component').then(m => m.NewsComponent)
            }
        ]
    }
];