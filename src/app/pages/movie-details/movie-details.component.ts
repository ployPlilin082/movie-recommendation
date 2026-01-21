import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import {TrailerButtonComponent} from '../../component/trailer-button/trailer-button.component';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';
import { UserHistoryService } from '../../services/๊userhistory.service';

interface Genre {
  id: number;
  name: string;
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, TrailerButtonComponent],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})

export class MovieDetailsComponent implements OnInit {

  movie: any;
  genreText: string = '';
  showToast = false;
  toastMessage = '';



  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private playlistService: PlaylistService,
    private userHistoryService: UserHistoryService
    
  ) {}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (!id) return;

    this.movieService.getMovieDetail(id).subscribe(res => {
      this.movie = {
        ...res,
        media_type: 'movie'
      };

      if (this.movie.genres) {
        this.genreText = this.movie.genres
          .map((g: Genre) => g.name)
          .join(', ');
      }
    });
  });
}

getShareUrl(postId: number) {
  return `${window.location.origin}/community/reviews/${postId}`;
}
likeMovie() {
  this.movieService.likeMovie(this.movie.id).subscribe(() => {
    this.movie.likeCount = (this.movie.likeCount ?? 0) + 1;
    this.userHistoryService.log({
    movieId: this.movie.id,
    interactionTypeId: 2 
  });
  });
}

shareMovie() {
  const url = `${window.location.origin}/movie/${this.movie.id}`;

  this.movieService.shareMovie(this.movie.id).subscribe(() => {
    this.movie.shareCount = (this.movie.shareCount ?? 0) + 1;
  });

  if (navigator.share) {
    navigator.share({
      title: this.movie.title,
      text: 'หนังเรื่องนี้น่าดูมาก 🎬',
      url
    });
  } else {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    );
    this.userHistoryService.log({
    movieId: this.movie.id,
    interactionTypeId: 3 // View
  });
}
}

  getImage(path: string) {
    return 'https://image.tmdb.org/t/p/w500' + path;
  }
addToMyList() {
  this.playlistService.addMyItem(this.movie).subscribe({
    next: () => {
      this.toastMessage = `Added "${this.movie.title}" to My List`;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    },
    error: err => {
      console.error(err);
      this.toastMessage = 'Failed to add movie to My List';
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    }
  });
}

}