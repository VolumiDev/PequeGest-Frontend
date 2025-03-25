
import { Routes } from '@angular/router';
import { NotAutheticatedGuard } from './auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => 
      import('./auth/auth.routes'),
    canMatch: [
      NotAutheticatedGuard,
    ]
  },
  {
    path: 'home',
    loadChildren:() => 
      import('./pages/main.routes').then((m) => m.routes),
      //TODO PONER EL GUARD A LAS RUTAS PARA QUE SOLO TENGAN ACCESO LOS USUARIOS CON TOKEN
  },
  {
    path: '**',
    redirectTo: 'auth',
  }
];
