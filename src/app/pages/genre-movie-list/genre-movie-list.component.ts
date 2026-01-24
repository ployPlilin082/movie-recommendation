import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { UserHistoryService } from '../../services/๊userhistory.service';
import { AnalyticsService } from '../../services/analytics.service';




@Component({
  selector: 'app-genre-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './genre-movie-list.component.html',
  styleUrls: ['./genre-movie-list.component.css']
})
export class GenreMovieListComponent implements OnInit {

  genreId!: number;
  genreName = '';
  movies: any[] = [];
  loading = false;

  skeletons = Array(8).fill(0);

  page = 1;
  hasMore = true;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
   private userHistoryService: UserHistoryService,
    private analytics: AnalyticsService,  
  ) {}

  ngOnInit() {
    this.genreId = Number(this.route.snapshot.paramMap.get('id'));

    this.movieService.getGenres().subscribe(res => {
      const g = res.find((x: any) => x.id === this.genreId);
      this.genreName = g?.name || 'Movies';
    });

    this.loadMovies();
  }

  loadMovies() {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.movieService.getMoviesByGenre(this.genreId, this.page).subscribe({
      next: res => {
        const results = res.results || [];

        this.movies = [...this.movies, ...results];

        if (results.length < 20) {
          this.hasMore = false; 
        }

        this.page++;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  
  onScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      this.loadMovies();
    }
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

  getImage(path: string) {
    return path
      ? 'https://image.tmdb.org/t/p/w500' + path
      :  'img/movie.png';
  }
}

