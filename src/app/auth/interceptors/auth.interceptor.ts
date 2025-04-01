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

  // Inject the current `AuthService` and use it to get an authentication token:
  const token = inject(AuthService).token();

  if (!token) return next(req);

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}
