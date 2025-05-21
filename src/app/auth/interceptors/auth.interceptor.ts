import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  if (req.url.includes('restcountries.com')) {
    return next(req);
  }

  const token = inject(AuthService).token();

  if (!token) return next(req);

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}
