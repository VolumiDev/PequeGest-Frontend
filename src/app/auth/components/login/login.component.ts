import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: `
    :host {
      display: block;
    }
  `
})
export class LoginComponent {
  signInForm!: UntypedFormGroup
  submitted: boolean = false

  public fb = inject(UntypedFormBuilder)
  public authService = inject(AuthService);
  // public store = inject(Store)

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['user@demo.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    })
  }

  get formValues() {
    return this.signInForm.controls
  }

  onSubmit() {
    this.submitted = true
    if (this.signInForm.valid) {
      const email = this.formValues['email'].value
      const password = this.formValues['password'].value

      // Login Api
      // this.store.dispatch(login({ email: email, password: password }))
    }
  }

}
