import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit, OnDestroy {

  accountForm: FormGroup = new FormGroup({});
  currentBackdrop: string | null = null;
  currentMovieTitle: string | null = null;
  showPassword: boolean = false;  
  isLoading: boolean = false;
  errorMessage: string | null = null;


  private backdrops: string[] = [];
  private slideInterval: any;
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p/w1280';
  private movies: { backdrop: string; title: string }[] = [];


  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
     private authService: AuthService,
     private router: Router
  ) {}

  ngOnInit(): void {
    // form
    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      agreeTerms: [false, Validators.requiredTrue]
    });

    // load movie backdrops
    this.loadBackdrops();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

 loadBackdrops(): void {
  this.movieService.getTrendingMovies().subscribe(res => {
    this.movies = res.results
      .filter((m: any) => m.backdrop_path)
      .map((m: any) => ({
        backdrop: this.imageBaseUrl + m.backdrop_path,
        title: m.title
      }));

    if (this.movies.length) {
      this.startSlideshow();
    }
  });
}
startSlideshow(): void {
  let index = 0;

  this.setImage(index);

  this.slideInterval = setInterval(() => {
    index = (index + 1) % this.movies.length;
    this.setImage(index);
  }, 5000);
}

setImage(index: number) {
  const img = new Image();
  img.src = this.movies[index].backdrop;

  img.onload = () => {
    this.currentBackdrop = this.movies[index].backdrop;
    this.currentMovieTitle = this.movies[index].title;
  };
}
togglePassword(): void {
    this.showPassword = !this.showPassword;
  }



   async onSubmit() {
    if (this.accountForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.accountForm.value;

    try {
      await this.authService.signUp(email, password);
      this.router.navigate(['/sign-in']); 
    } catch (error: any) {
      this.errorMessage = error.code === 'auth/email-already-in-use'
        ? 'This email is already in use.'
        : 'Signup failed';
    } finally {
      this.isLoading = false;
    }
  }
async singInwithGoogle(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
      console.log("User signed in with Google successfully");
      this.router.navigate(['/sign-in']); 
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }
  async signInwithFacebook(): Promise<void> {
    try {
      await this.authService.signInWithFacebook();
      console.log("User signed in with Facebook successfully");
      this.router.navigate(['/sign-in']); 
    }
    catch (error) {
      console.error("Error signing in with Facebook:", error);
    }   
  }
}
