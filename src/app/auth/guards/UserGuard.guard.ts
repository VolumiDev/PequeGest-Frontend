import {
  Router,
  type CanMatchFn,
  type Route,
  type UrlSegment,
  type UrlTree,
} from '@angular/router';
import { AuthService } from '../services/Auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const UserGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = await firstValueFrom(authService.checkStatus());
  const role = authService.getUserRole();

  if (!isAuth) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: '/' + segments.map((s) => s.path).join('/') },
    });
  }

  if (role != 'USER') {
    return router.createUrlTree(['/admin/users']);
  }
  return true;
};
