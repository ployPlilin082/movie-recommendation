import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
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
  getBackdrop(path: string) {
    return 'https://image.tmdb.org/t/p/original' + path;
  }
  getPoster(path: string) {
    return 'https://image.tmdb.org/t/p/w500' + path;
  }
}
