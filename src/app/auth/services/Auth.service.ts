import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/enviroment';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { AuthResponse } from '../interfaces/AuthResponse.interface';
import { UserAuth } from '../interfaces/UserAuth.interface';
import { Router } from '@angular/router';



type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserAuth | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);
  private router = inject(Router);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
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

    console.log(`${baseUrl}/auth/login`, 
      {
        email: email,
        password: password
      }
    )

    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handelAuthError(error))
    );
  };


   checkStatus(): Observable<boolean> {

    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handelAuthError(error))
    )
  }



  logout(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }
  
  sessionClose(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
  
    localStorage.removeItem('token');
    
    this.router.navigateByUrl("/auth/login");
  }


  private handleAuthSuccess({ token, userAuth } : AuthResponse){
    
    this._user.set(userAuth)
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);
    return true;
  }


  private handelAuthError(error: any){
    this.logout()
    return of(false);
  }
}