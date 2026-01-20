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
      return;
    }

    this.loading = true;
    this.authError = null;

    const { username, password } = this.signInForm.value;

    try {
      await this.authService.signIn(username, password);
      this.authService.syncUserToDb();
      this.router.navigate(['/home']);
      await this.authService.debugToken();


    } catch (err: any) {


      switch (err.code) {
        case 'auth/user-not-found':
          this.authError = 'Account not found';
          break;

        case 'auth/wrong-password':
          this.authError = 'Invalid email or password';
          break;

        case 'auth/email-not-verified':
          this.authError =
            'Your email is not verified. We’ve sent a verification email again. Please check your inbox or spam.';
          break;

        default:
          this.authError = 'Something went wrong. Please try again';
      }

    } finally {
      this.loading = false;
    }
  }
  googleSignIn(): void {
  this.authService.signInWithGoogle()
    .then(async () => {
      await this.authService.syncUserToDb();
      this.router.navigate(['/home']);
    })
    .catch(() => {
      this.authError = 'Google login failed';
    });
}

//   facebookSignIn(): void {
//   this.authService.signInWithFacebook()
//     .then(async () => {
//       await this.authService.syncUserToDb();
//       this.router.navigate(['/home']);
//     })
//     .catch(() => {
//       this.authError = 'Facebook login failed';
//     });
// }


}
