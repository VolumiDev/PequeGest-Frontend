import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/enviroment';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { AuthResponse } from '../interfaces/AuthResponse.interface';
import { UserAuth } from '../interfaces/UserAuth.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserAuth | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {

      return 'authenticated';
    }
    return 'not-authenticated';
  });

  user = computed(() => this._user());

  token = computed(() => this._token());


  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      tap(resp => {
        console.log("credenciales correctas");

        this._user.set(resp.userAuth)
        this._authStatus.set('authenticated');
        this._token.set(resp.token);

        localStorage.setItem('token', resp.token);
      }),
      map(() => true),
      catchError((error: any) => {
        console.log("credenciales incorrectas");
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        return of(false);
      })
    )
  }


   checkStatus(): Observable<boolean> {

    const token = localStorage.getItem('token');

    if (!token) {
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).pipe(
      tap(resp => {
        console.log("credenciales correctas");

        this._user.set(resp.userAuth)
        this._authStatus.set('authenticated');
        this._token.set(resp.token);

        localStorage.setItem('token', resp.token);
      }),
      map(() => true),
      catchError((error: any) => {
        console.log("credenciales incorrectas");
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        return of(false);
      })
    )
  }

}