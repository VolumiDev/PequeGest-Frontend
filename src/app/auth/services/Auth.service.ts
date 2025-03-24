import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/enviroment';

import { User } from '../interfaces/User.interface';
import { LoginResponse } from '../interfaces/loginResponse.interface';
import { tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';

  })

  user = computed<User | null>(() => this._user());

  tocken = computed<string | null>(() => this._token());


  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      tap(resp => {
        this._user.set(resp.user);
        this._authStatus.set('authenticated');
        this._token.set(resp.token);

        localStorage.setItem('token', resp.token);
      })
    )
  }
}