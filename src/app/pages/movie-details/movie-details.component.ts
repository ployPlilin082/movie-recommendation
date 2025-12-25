import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';

interface Genre {
  id: number;
  name: string;
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})

export class MovieDetailsComponent implements OnInit {

  movie: any;
  genreText: string = '';


  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

  this.movieService.getMovieDetail(id).subscribe(res => {
  this.movie = res;

  if (this.movie.genres) {
    this.genreText = this.movie.genres.map((g:Genre) => g.name).join(', ');
  }
});
  }

  getImage(path: string) {
    return 'https://image.tmdb.org/t/p/w500' + path;
  }
  
}
