import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  trendingMovies: any[] = [];
  mainMovie: any;
  upNext: any[] = [];
  popularPeople: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getTrendingMovies().subscribe((res) => {
      this.trendingMovies = res.results.slice(0, 10);
      this.mainMovie = this.trendingMovies[0];
      this.upNext = this.trendingMovies.slice(1, 4);
    });

    this.movieService.getPopularPeople().subscribe((res) => {
      this.popularPeople = res.results.slice(0, 7);
    });
  }

  getImage(path: string): string {
    return path ? 'https://image.tmdb.org/t/p/w500' + path : 'assets/no-image.jpg';
  }

  openTrailer(id: number): void {
    this.movieService.getMovieDetails(id).subscribe((data) => {
      const trailer = data.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    });
  }
}
