import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Stored_Keys } from '../../../../Core/constants/stored_keys';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  auth_service = inject(AuthService);
  router = inject(Router);
  showPassword: boolean = false;
  isLoading: boolean = false;
  invalid: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    ]),
  });

  onSubmit(): void {
    if (this.isLoading) return;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.auth_service.Login(this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem(Stored_Keys.USER_TOKEN, response.data.token);
        localStorage.setItem(
          Stored_Keys.USER_DATA,
          JSON.stringify(response.data),
        );
        localStorage.setItem(Stored_Keys.USER_ID, response.data.user._id);
        this.router.navigate(['/feed']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.invalid = true;
        this.isLoading = false;
      },
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
