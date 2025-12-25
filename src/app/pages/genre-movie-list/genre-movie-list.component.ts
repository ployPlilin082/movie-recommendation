import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';

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
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.genreId = Number(this.route.snapshot.paramMap.get('id'));

    this.movieService.getGenres().subscribe(res => {
      const g = res.genres.find((x: any) => x.id === this.genreId);
      this.genreName = g?.name || 'Movies';
    });

    this.movieService.getMoviesByGenre(this.genreId).subscribe(res => {
      this.movies = res.results;
      this.loading = false;
    });
  }

  openMovie(id: number) {
    this.router.navigate(['/movie', id]);
  }

  getImage(path: string) {
    return 'https://image.tmdb.org/t/p/w500' + path;
  }
}
