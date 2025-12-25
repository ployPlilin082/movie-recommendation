import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signInForm!: FormGroup;
  authError: string | null = null;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authError = null;

    const { username, password } = this.signInForm.value;

    try {
      await this.authService.signIn(username, password);
      this.router.navigate(['/home']);
    } catch (err: any) {

   
      switch (err.code) {
        case 'auth/user-not-found':
          this.authError = 'Account not found';
          break;

        case 'auth/wrong-password':
          this.authError = 'Invalid email or password';
          break;

        case 'auth/invalid-email':
          this.authError = 'Invalid email format';
          break;

        default:
          this.authError = 'Something went wrong. Please try again';
      }

    } finally {
      this.loading = false;
    }
  }
  googleSignIn(): void {
    this.authService.signInWithGoogle().then(() => {
      this.router.navigate(['/home']);
    });
  }
  
}
