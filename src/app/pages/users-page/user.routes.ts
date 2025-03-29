import { Routes } from '@angular/router';
import { UsersPageComponent } from './users-page.component';

export const routes: Routes = [
  {
    path: "",
    component: UsersPageComponent,
    children: [
      {
        path: 'students',
        loadComponent: () => 
          import('./components/students-table/students-table.component').then((c) => c.StudentsTableComponent),
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
