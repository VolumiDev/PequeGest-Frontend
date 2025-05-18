import { Routes } from '@angular/router';
import { NotAutheticatedGuard } from './auth/guards/not-authenticated.guard';
import { AdminGuard } from './auth/guards/AdminGuard.guard';
import { UserGuard } from './auth/guards/UserGuard.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [NotAutheticatedGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./routes/main.routes').then((m) => m.routes),
    canMatch: [AdminGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./routes/user.routes').then((m) => m.routes),
    canMatch: [UserGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
