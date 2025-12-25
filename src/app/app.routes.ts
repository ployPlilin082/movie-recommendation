import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth.guard';
import { noAuthGuard } from './services/auth/no-auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie-details/movie-details.component').then(c => c.MovieDetailsComponent)
  },
  {
    path: 'playlist',
    loadComponent: () =>
      import('./pages/playlist/playlist.component').then(c => c.PlaylistComponent)
  },

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
   {
    path: 'footer',
    loadComponent: () =>
      import('./pages/footer/footer.component').then(c => c.FooterComponent)
  },
  {
    path:'cost-calculator',
    loadComponent: () =>
      import('./pages/cost-calculator/cost-calculator.component').then(c => c.CostCalculatorComponent)
  },
  {
    path:'chat',
    loadComponent: () =>
      import('./pages/chat/chat.component').then(c => c.ChatComponent)
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./pages/schedule/schedule.component').then(c => c.ScheduleComponent)
  },
  {
    path:'community',
    loadComponent: () =>
      import('./pages/community/community.component').then(c => c.CommunityComponent)
  },
  {
  path: 'genre/:id',
  loadComponent: () =>
    import('./pages/genre-movie-list/genre-movie-list.component')
      .then(m => m.GenreMovieListComponent)
}

];

