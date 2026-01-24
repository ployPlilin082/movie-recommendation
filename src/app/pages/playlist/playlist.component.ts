import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PlaylistService } from '../../services/playlist.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserHistoryService } from '../../services/๊userhistory.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  myList: any[] = [];
  removingIds = new Set<number>();

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private analytics: AnalyticsService,
    private userHistoryService: UserHistoryService

  ) { }

  ngOnInit(): void {
    this.playlistService.getMyItems().subscribe({
      next: res => this.myList = res.items ?? [],
      error: err => console.error(err)
    });
  }

  get count(): number {
    return this.myList?.length ?? 0;
  }

  remove(movieId: number) {
    this.playlistService.removeMyItem(movieId).subscribe({
      next: () => {
        this.myList = this.myList.filter(x => x.movieId !== movieId);
      },
      error: err => console.error(err)
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

  getImage(path?: string) {
    return path
      ? 'https://image.tmdb.org/t/p/w500' + path
      : 'assets/no-image.png'; // รูป fallback
  }

}
