import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './loginPage.component.html',
})
export class LoginPageComponent { 


  fb = inject(FormBuilder);
  authService = inject(AuthService);
  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', 
      [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern('^(?=.*[A-Z])(?=.*\d).{6,}$')
      ],
    ],
  });

  onSubmit() {
    if(this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }
    
    const { email = '', password = ''} = this.loginForm.value; 

    this.authService.login(email!, password!).subscribe(resp => {
      console.log(resp);
      
    })
      
  }

}
