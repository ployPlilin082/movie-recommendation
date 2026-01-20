import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { CarouselComponent } from '../../component/carousel/carousel.component';
import { HeroSliderComponent } from '../../component/hero-slider/hero-slider.component';
import { PlaylistService } from '../../services/playlist.service';
import { UserHistoryService } from '../../services/๊userhistory.service';
import { RecommendationService } from '../../services/recommendation.service';
import { AnalyticsService } from '../../services/analytics.service';


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
  recommendedMovies: any[] = [];

  constructor(private router: Router, private movieService: MovieService,private playlistService: PlaylistService, private userHistoryService: UserHistoryService, private recommendationService: RecommendationService, private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.log('page_home');

  // 🔹 Trending
  this.movieService.getTrendingMovies().subscribe(res => {
    this.trendingMovies = res;
    
  });
  this.recommendationService.getRecommendations().subscribe({
  next: res => {
    this.recommendedMovies = res;

    if (res.length > 0) {
      this.analytics.log('view_recommendations', {
        count: res.length
      });
    }
  },
  error: err => {
    console.warn('No recommendations yet', err);
    this.recommendedMovies = [];
  }
});


  this.movieService.getPopularMoviesThisWeek().subscribe(res => {
    this.popularWeekLarge = res.slice(0, 3);
    this.popularWeekSmall = res.slice(3, 10);
    this.mainMovie = res[0];
  });
   this.movieService.getPopularPeople().subscribe(res => {
    this.popularPeople = res;
  });

  // 🔹 Genres 
  this.movieService.getGenres().subscribe(res => {
    this.genres = res;         
  });

  // 🔹 Top Picks
  this.movieService.getTopPicks().subscribe(res => {
    this.topPicks = res.slice(0, 10);
    this.featuredMovies = res;
  });
}



 openMovie(id: number) {

   this.analytics.log('open_movie', { movie_id: id });

  this.userHistoryService.log({
    movieId: id,
    interactionTypeId: 2 
  }).subscribe({
    next: () => {
    
      this.router.navigate(['/movie', id]);
    },
    error: err => {
      console.error('log failed', err);
   
      this.router.navigate(['/movie', id]);
    }
  });
}


 getImage(path?: string) {
  return path
    ? 'https://image.tmdb.org/t/p/w500' + path
    : 'assets/no-image.png'; // รูป fallback
}

 addToList(movie: any) {
  
  this.analytics.log('add_to_playlist', {
    movie_id: movie.id,
    title: movie.title
  });

  this.playlistService.addMyItem(movie).subscribe({
    next: () => alert('Added to My List'),
    error: err => {
      console.error(err);
      alert('Add failed');
    }
  });
}


openGenre(id: number) {
  this.router.navigate(['/genre', id]);
}



}
