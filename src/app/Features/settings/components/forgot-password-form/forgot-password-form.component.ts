import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../Core/services/users.service';

@Component({
  selector: 'app-forgot-password-form',
  imports: [ ReactiveFormsModule , TranslatePipe],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.css',
})
export class ForgotPasswordFormComponent {
  toastr = inject(ToastrService);
  usersService = inject(UsersService);

  forgotPasswordForm: FormGroup = new FormGroup(
    {
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: this.matchPasswordValidator },
  );

  matchPasswordValidator(formGroup: AbstractControl) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.usersService.changePassword(
        this.forgotPasswordForm.value.currentPassword,
        this.forgotPasswordForm.value.newPassword
      ).subscribe({
        next: () => {
          this.toastr.success('Password updated successfully!', 'Success');
        },
        error: (err) => {
          this.toastr.error('Failed to update password.', 'Error');
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
