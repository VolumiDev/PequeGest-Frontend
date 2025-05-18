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
          import('../pages/userUI/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'children',
        loadComponent: () =>
          import('../pages/userUI/student/student.component').then(
            (c) => c.StudentComponent
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('../pages/userUI/messages/messages.component').then(
            (c) => c.MessagesComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
