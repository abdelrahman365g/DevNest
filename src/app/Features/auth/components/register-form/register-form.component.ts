import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  auth_service = inject(AuthService);
  router = inject(Router);
  submitted = false;
  toastr = inject(ToastrService);
  showPassword: boolean = false;
  showRePassword: boolean = false;

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      username: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ),
      ]),
      rePassword: new FormControl('', Validators.required),
    },
    { validators: this.matchPasswordValidator },
  );

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.auth_service.Register(this.registerForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
          this.toastr.success(response.message);
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          console.error('Registration failed:', error);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  matchPasswordValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const rePassword = formGroup.get('rePassword')?.value;

    if (password !== rePassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleRePassword() {
    this.showRePassword = !this.showRePassword;
  }
}
