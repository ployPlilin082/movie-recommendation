import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserHistoryService } from '../../services/๊userhistory.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  isDark = true;
  isMenuOpen = false;
  isSearchOpen = false;

  user: User | null = null;
  avatarBlobUrl: string | null = null;

  searchText = '';
  results: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private movieService: MovieService,
     private analytics: AnalyticsService,
    private userHistoryService: UserHistoryService
  ) {}

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    this.isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', this.isDark);

    this.authService.user$.subscribe(async user => {
      this.user = user;

      if (!user) {
        this.avatarBlobUrl = null;
        return;
      }

      const token = await user.getIdToken();
      this.authService.getMyPhoto(token).subscribe({
        next: (blob: Blob) => {
          this.avatarBlobUrl = URL.createObjectURL(blob);
        },
        error: () => {
          this.avatarBlobUrl = null;
        }
      });
    });

    this.authService.avatarRefresh$.subscribe(async () => {
      if (!this.user) return;

      const token = await this.user.getIdToken();
      this.authService.getMyPhoto(token).subscribe({
        next: (blob: Blob) => {
          if (this.avatarBlobUrl) {
            URL.revokeObjectURL(this.avatarBlobUrl);
          }
          this.avatarBlobUrl = URL.createObjectURL(blob);
        },
        error: () => {
          this.avatarBlobUrl = null;
        }
      });
    });
  }
  toggleSearch() {
  this.isSearchOpen = !this.isSearchOpen;

  if (!this.isSearchOpen) {
    this.searchText = '';
    this.results = [];
  }

  // ปิดเมนูข้างถ้าเปิดอยู่
  this.isMenuOpen = false;
}


  
  // 🍔 Menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu() {
    this.isMenuOpen = false;
  }
  openSearch() {
  this.isSearchOpen = true;
  // (optional) ปิดเมนูถ้าเปิดอยู่
  this.isMenuOpen = false;
}

closeSearch() {
  this.isSearchOpen = false;
  this.searchText = '';
  this.results = [];
}

  // 🔐 Auth
  logout() {
    this.authService.signOut();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  // 🔍 Search (Dropdown)
  onSearchInput() {
    const q = this.searchText.trim();

    if (q.length < 2) {
      this.results = [];
      return;
    }

    this.movieService.searchMovies(q).subscribe(res => {
      this.results = res.slice(0, 6);
    });
  }

openMovie(id: number, mediaType: 'movie' | 'tv' = 'movie') {

    this.analytics.log('open_movie', { movie_id: id, mediaType });

    this.userHistoryService.log({
      movieId: id,
      interactionTypeId: 2
    }).subscribe({
      next: () => {
        this.router.navigate(
          ['/movie', id],
          { queryParams: { mediaType } } // ✅ ตรงนี้สำคัญ
        );
      },
      error: err => {
        console.error('log failed', err);
        this.router.navigate(
          ['/movie', id],
          { queryParams: { mediaType } }
        );
      }
    });
  }

  // 🖼️ Image helper
  getImage(path?: string) {
    return path
      ? 'https://image.tmdb.org/t/p/w200' + path
      : 'assets/no-image.png';
  }
}
