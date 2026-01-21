import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth.guard';
import { noAuthGuard } from './services/auth/no-auth.guard';

export const routes: Routes = [
  //  Public (ไม่ต้องล็อกอิน)
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie-details/movie-details.component').then(c => c.MovieDetailsComponent)
  },
  {
  path: 'forgot-password',
  loadComponent: () =>
    import('./component/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
},


  
  {
    path: 'genre/:id',
    loadComponent: () =>
      import('./pages/genre-movie-list/genre-movie-list.component')
        .then(m => m.GenreMovieListComponent)
  },
  {
    path: 'footer',
    loadComponent: () =>
      import('./pages/footer/footer.component').then(c => c.FooterComponent)
  },

  //  Protected (ต้องล็อกอิน)
  {
    path: 'playlist',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/playlist/playlist.component').then(c => c.PlaylistComponent)
  },
  {
    path:'cost-calculator',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cost-calculator/cost-calculator.component').then(c => c.CostCalculatorComponent)
  },
  {
    path:'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/chat/chat.component').then(c => c.ChatComponent)
  },
  {
    path: 'schedule',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/schedule/schedule.component').then(c => c.ScheduleComponent)
  },
  {
    path:'community',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/community/community.component').then(c => c.CommunityComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(c => c.ProfileComponent)
  },

  //  Auth pages (ล็อกอินแล้วห้ามเข้า)
  {
    path: 'sign-in',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./pages/sign-in/sign-in.component').then(c => c.SignInComponent)
  },
  {
    path: 'create-account',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./pages/create-account/create-account.component').then(c => c.CreateAccountComponent)
  },

  // optional default route
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
 
];

