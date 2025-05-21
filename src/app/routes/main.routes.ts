import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../shared/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../pages/dashboard-page/dashboard-page.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'classrooms',
        loadComponent: () =>
          import('../pages/classrooms-page/classrooms-page.component').then(
            (c) => c.ClassroomsPageComponent
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('../pages/messages-page/messages-page.component').then(
            (c) => c.MessagesComponent
          ),
      },
      {
        path: 'users',
        loadChildren: () => import('./lists.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: 'users',
      },
    ],
  },
];
