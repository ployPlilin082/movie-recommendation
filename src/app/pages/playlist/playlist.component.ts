import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PlaylistService } from '../../services/playlist.service';

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
    private router: Router
  ) {}

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
  openDetail(id: number) {
    this.router.navigate(['/movie', id]);
  }

  getImage(path?: string) {
  return path
    ? 'https://image.tmdb.org/t/p/w500' + path
    : 'assets/no-image.png'; // รูป fallback
}

}
