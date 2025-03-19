import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes')
    //TODO guards,
  },


  {
    path: '**',
    redirectTo: 'auth',
  }
  

];
