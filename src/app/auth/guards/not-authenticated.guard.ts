import { inject } from '@angular/core';
import {
  CanMatchFn,
  Route,
  Router,
  ROUTER_INITIALIZER,
  UrlSegment,
} from '@angular/router';
import { AuthService } from '../services/Auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAutheticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  if (isAuthenticated) {
    router.navigateByUrl('/admin/users');
    return true;
  }

  return true;
};
