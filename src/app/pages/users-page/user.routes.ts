import { Routes } from '@angular/router';
import { UsersPageComponent } from './users-page.component';
import { StudentDashboardComponent } from './components/students/studentsDashboard/studentDashboard.component';

export const routes: Routes = [
  {
    path: "",
    component: UsersPageComponent,
    children: [
      {
        path: 'students',
        component: StudentDashboardComponent,
        loadChildren: () =>
          import('./components/students/studentsDashboard/students.routes').then((m) => m.routes)
      },
      {
        path: 'educators',
        loadComponent: () =>
          import('./components/educators-table/educators-table.component').then((c) => c.EducatorsTableComponent),
      },
      {
        path: '**',
        redirectTo: "students",
      },
    ],
  },
]
