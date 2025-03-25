
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => 
      import('./auth/auth.routes')
    //TODO guards,
  },
  {
    path: 'home',
    loadChildren:() => 
      import('./pages/main.routes').then((m) => m.routes)
  },


  {
    path: '**',
    redirectTo: 'auth',
  }
  

];
