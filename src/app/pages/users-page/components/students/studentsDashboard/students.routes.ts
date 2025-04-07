import { Routes } from "@angular/router";


export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./listAddStudents/listAddStudents.component').then((c) => c.ListAddStudentsComponent)
    },
    {
        path: ':studentHash',
        loadComponent: () =>
            import('./studentDetailsLayout/studentDetailsLayout.component').then((c) => c.StudentDetailsLayoutComponent)
    },
    {
        path: '**',
        redirectTo: '',
    },
]