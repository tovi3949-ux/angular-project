import { Routes } from '@angular/router';
import { authGuard } from './guard/auth-guard';
import { Teams } from './components/teams/teams';
import { Enter } from './components/enter/enter';
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: Enter
    },
    {
        path: 'teams',
        component: Teams,
        canActivate: [authGuard]
    },
];