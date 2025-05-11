import { Routes } from '@angular/router';
import { CoreRoutes } from './core-components/core.routes';
import { authCanActivateGuard } from './auth-components/auth-guard/auth-can-activate.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-components/sign-in/sign-in.component').then(m => m.SignInComponent),
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadComponent: () => import('./auth-components/sign-in/sign-in.component').then(m => m.SignInComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./core-components/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authCanActivateGuard],
    children: CoreRoutes
  },
];
