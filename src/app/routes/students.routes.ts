import { Routes } from "@angular/router";
import { StudentDetailsLayoutComponent } from "../pages/users-page/components/students/studentsDashboard/studentDetailsLayout/studentDetailsLayout.component";


export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../pages/users-page/components/students/studentsDashboard/listAddStudents/listAddStudents.component').then((c) => c.ListAddStudentsComponent)
    },
    {
        path: ':studentHash',
        component: StudentDetailsLayoutComponent,
        loadChildren: () =>
            import('./studentDashboard.routes').then((m) => m.routes)
    },
    {
        path: '**',
        redirectTo: '',
    },
]