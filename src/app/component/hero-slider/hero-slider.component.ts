import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import {TrailerButtonComponent} from '../../component/trailer-button/trailer-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule, TrailerButtonComponent],
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css'],
})
export class HeroSliderComponent {
  @Input() movies: any[] = [];
  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.movies.length) % this.movies.length;
  }
 getBackdrop(path?: string | null) {
  return path
    ? 'https://image.tmdb.org/t/p/original' + path
    : ''; // หรือใส่ fallback image ก็ได้
}


  getPoster(path: string | null, poster?: string | null) {
  if (path) {
    return 'https://image.tmdb.org/t/p/original' + path;
  }
  if (poster) {
    return 'https://image.tmdb.org/t/p/w780' + poster;
  }
  return 'assets/hero-fallback.jpg';
}
}
