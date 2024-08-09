import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { FloatVotesComponent } from './nested-container/float-votes/float-votes.component';
import { FloatVotesChoicesComponent } from './nested-container/float-votes-choices/float-votes-choices.component';
import { FloatBidaKaMechanicsComponent } from './nested-container/float-bida-ka-mechanics/float-bida-ka-mechanics.component';

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
        path: 'vote',
        component: FloatVotesComponent
    },
    // {
    //     path: 'bida',
    //     component: FloatBidaKaMechanicsComponent
    // },
    {
        path: 'float-vote-choices',
        component: FloatVotesChoicesComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
