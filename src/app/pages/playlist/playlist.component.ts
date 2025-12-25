import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, MyListMovie } from '../../services/movie.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  myList: MyListMovie[] = [];
  removingIds = new Set<number>();
  sub!: Subscription;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.movieService.myList$.subscribe((list: MyListMovie[]) => {
      console.log('Updated myList:', list);
      this.myList = list;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get count(): number {
    return this.myList.length;
  }

  toggle(movie: MyListMovie) {
    // animation ก่อนลบ
    this.removingIds.add(movie.id);

    setTimeout(() => {
      this.movieService.toggleMyList(movie);
      this.removingIds.delete(movie.id);
    }, 200);
  }

  getImage(path?: string) {
    return path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : 'assets/noimage.jpg';
  }

  openDetail(id: number) {
    this.router.navigate(['/movie', id]);
  }
}
