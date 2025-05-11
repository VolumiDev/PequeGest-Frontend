import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../pages/users-page/components/students/studentsDashboard/studentDetailsLayout/studentProfile/studentProfile.component'
      ).then((c) => c.StudentProfileComponent),
  },
  {
    path: 'messages',
    loadComponent: () =>
      import(
        '../pages/users-page/components/students/studentsDashboard/studentDetailsLayout/studentChat/studentChat.component'
      ).then((c) => c.StudentChatComponent),
  },
  {
    path: 'documents',
    loadComponent: () =>
      import(
        '../pages/users-page/components/students/studentsDashboard/studentDetailsLayout/studentsDocumentsList/studentsDocumentsList.component'
      ).then((c) => c.StudentsDocumentsListComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
