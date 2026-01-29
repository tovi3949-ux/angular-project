import { Routes } from '@angular/router';
import { authGuard } from './guard/auth-guard';
import { Teams } from './components/teams/teams';
import { Enter } from './components/enter/enter';
import { Projects } from './components/projects/projects';
import { TaskBoard } from './components/task-board/task-board';
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
    {
        path: 'projects/:teamId',
        component: Projects,
        canActivate: [authGuard]
    },
    {
        path: 'tasks/:projectId',
        component: TaskBoard,
        canActivate: [authGuard]
    }
];