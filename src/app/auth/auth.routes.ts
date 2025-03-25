import { Routes } from "@angular/router"
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component"
import { LoginPageComponent } from './pages/loginPage/loginPage.component';
import { ForgotPasswordComponent } from "./pages/forgotPassword/forgotPassword.component";

export const authRoutes: Routes = [

  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/loginPage/loginPage.component').then((c) => c.LoginPageComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => 
          import('./pages/forgotPassword/forgotPassword.component').then((c) => c.ForgotPasswordComponent),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;