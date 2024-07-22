import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../app/nested-container/nested-container.routes').then(m => m.NESTED_CONTAINER_ROUTES)
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
