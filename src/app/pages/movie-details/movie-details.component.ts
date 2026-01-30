import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { TrailerButtonComponent } from '../../component/trailer-button/trailer-button.component';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';
import { UserHistoryService } from '../../services/๊userhistory.service';
import { Meta, Title } from '@angular/platform-browser';


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
    private userHistoryService: UserHistoryService,
    private meta: Meta,
    private title: Title



  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.route.queryParamMap.subscribe(q => {
        const mediaType = (q.get('mediaType') as 'movie' | 'tv') || 'movie';
        this.loadMovie(id, mediaType);
      });
    });
  }

 loadMovie(id: string, mediaType: 'movie' | 'tv') {
  this.movieService.getMovieDetail(id, mediaType).subscribe(res => {
    this.movie = res;
    this.genreText = this.movie.genres?.map((g: any) => g.name).join(', ') ?? '';

    // ====== SET OG TAGS FOR FACEBOOK ======
    const pageUrl = `${window.location.origin}/movie/${this.movie.id}`;
    const imageUrl = this.movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
      : `${window.location.origin}/img/movie.png`;

    this.title.setTitle(this.movie.title);

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: this.movie.title });
    this.meta.updateTag({
      property: 'og:description',
      content: this.movie.overview || 'หนังเรื่องนี้น่าดูมาก 🎬'
    });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });

    // (เผื่อ LINE / Twitter)
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
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

  async shareMovie() {
    const url = `${window.location.origin}/movie/${this.movie.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: this.movie.title,
          text: 'หนังเรื่องนี้น่าดูมาก 🎬',
          url
        });
      } else {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
      }

      this.userHistoryService.log({
        movieId: this.movie.id,
        interactionTypeId: 3 // Share
      });

    } catch (err) {

      console.log('Share cancelled');
    }
  }


  getImage(path: string) {
    return path
      ? 'https://image.tmdb.org/t/p/w500' + path
      : 'img/movie.png';
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
