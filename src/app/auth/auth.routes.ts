import { Routes } from "@angular/router"
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component"
import { LoginPageComponent } from "./pages/loginPage/loginPage.component"
import { ForgotPasswordComponent } from "./pages/forgotPassword/forgotPassword.component";

export const authRoutes: Routes = [

  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;