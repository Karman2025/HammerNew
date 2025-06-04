import { CustomerDetailedViewComponent } from './../app-components/customer-components/customer-detailed-view/customer-detailed-view.component';
import { Routes } from '@angular/router';
import { authCanActivateGuard } from '../auth-components/auth-guard/auth-can-activate.guard';

export const CoreRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../app-components/landing-page-components/home-page/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import('../app-components/landing-page-components/home-page/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'branches',
    loadComponent: () => import('../app-components/branch-components/branches/branches.component').then(m => m.BranchesComponent),
    canActivate: [authCanActivateGuard],
  },
  {
    path: 'customers',
    loadComponent: () => import('../app-components/customer-components/customers/customers.component').then(m => m.CustomersComponent),
  },
  {
    path: 'customers/customer-details',
    loadComponent: () => import('../app-components/customer-components/customer-detailed-view/customer-detailed-view.component').then(m => m.CustomerDetailedViewComponent),
  },
  {
    path: 'trainers',
    loadComponent: () => import('../app-components/trainers-components/trainers/trainers.component').then(m => m.TrainersComponent),
  },
  {
    path: 'payments',
    loadComponent: () => import('../app-components/payment-components/payments/payments.component').then(m => m.PaymentsComponent),
  },
  // {
  //   path: 'reports',
  //   loadComponent: () => import('../app-components/reports-component/reports-component.component').then(m => m.ReportsComponentComponent),
  // },
  {
    path: 'attendance',
    loadComponent: () => import('../app-components/attendance-components/attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  {
    path: 'accounts',
    loadComponent: () => import('../app-components/accounts-components/accounts/accounts.component').then(m => m.AccountsComponent)
  },
];
