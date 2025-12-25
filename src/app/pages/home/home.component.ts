import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { CarouselComponent } from '../../component/carousel/carousel.component';
import { HeroSliderComponent } from '../../component/hero-slider/hero-slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterModule,
    CarouselComponent,
    HeroSliderComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  featuredMovies: any[] = [];
  mainMovie: any;
  trendingMovies: any[] = [];
  popularPeople: any[] = [];
  popularWeekLarge: any[] = [];
  popularWeekSmall: any[] = [];
  genres: any[] = [];
  topPicks: any[] = [];

  constructor(private router: Router, private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getTrendingMovies().subscribe(res => {
      this.trendingMovies = res.results;
      this.featuredMovies = this.trendingMovies.slice(0, 5);
    });

    this.movieService.getPopularPeople().subscribe(res => {
      this.popularPeople = res.results;
    });

    this.movieService.getPopularMoviesThisWeek().subscribe(res => {
      this.popularWeekLarge = res.results.slice(0, 3);
      this.popularWeekSmall = res.results.slice(3, 10);
    });

    this.movieService.getGenres().subscribe(res => {
      this.genres = res.genres;
    });

    this.movieService.getTopPicks().subscribe(res => {
      this.topPicks = res.results.slice(0, 10);
    });
  }

  openMovie(id: number) {
    this.router.navigate(['/movie', id]);
  }

  getImage(path: string) {
    return 'https://image.tmdb.org/t/p/w500' + path;
  }
  addToList(movie: any) {
  console.log("Added to My List:", movie);

  // ถ้าคุณอยากให้เก็บจริง ให้ใช้ localStorage แบบนี้
  let list = JSON.parse(localStorage.getItem('myList') || '[]');
  list.push(movie);
  localStorage.setItem('myList', JSON.stringify(list));
}
openGenre(id: number) {
  this.router.navigate(['/genre', id]);
}


}
