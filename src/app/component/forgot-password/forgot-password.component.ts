import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // ✅ สร้าง form หลังจาก fb พร้อมแล้ว
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    try {
      await this.authService.resetPassword(this.form.value.email!);
      this.successMessage =
        'Password reset email sent. Please check your inbox.';
    } catch {
      this.errorMessage = 'Email not found or something went wrong.';
    } finally {
      this.loading = false;
    }
  }

  backToLogin() {
    this.router.navigate(['/sign-in']);
  }
}

