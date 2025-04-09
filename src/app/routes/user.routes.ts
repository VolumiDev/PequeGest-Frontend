import { Routes } from '@angular/router';
import { UsersPageComponent } from '../pages/users-page/users-page.component';
import { StudentDashboardComponent } from '../pages/users-page/components/students/studentsDashboard/studentDashboard.component';

export const routes: Routes = [
  {
    path: "",
    component: UsersPageComponent,
    children: [
      {
        path: 'students',
        component: StudentDashboardComponent,
        loadChildren: () =>
          import('./students.routes').then((m) => m.routes)
      },
      {
        path: 'educators',
        loadComponent: () =>
          import('../pages/users-page/components/educators-table/educators-table.component').then((c) => c.EducatorsTableComponent),
      },
      {
        path: '**',
        redirectTo: "students",
      },
    ],
  },
]
