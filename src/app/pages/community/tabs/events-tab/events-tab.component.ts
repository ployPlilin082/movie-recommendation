import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../../../../services/CommunityService';

@Component({
  selector: 'app-events-tab',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events-tab.component.html',
  styleUrl: './events-tab.component.css'
})
export class EventsTabComponent {

  @Input() events: any[] = [];
  @Output() refresh = new EventEmitter<boolean>();



  title = '';
  description = '';
  startDate = '';
  endDate = '';

  movieKeyword = '';
  movieResults: any[] = [];
  selectedMovie: any | null = null;
  editingEvent: any | null = null;


  constructor(private community: CommunityService) { }

  searchMovie() {
    if (this.movieKeyword.length < 2) {
      this.movieResults = [];
      return;
    }

    this.community.searchMovies(this.movieKeyword)
      .subscribe(r => this.movieResults = r);
  }

  selectMovie(m: any) {
    this.selectedMovie = m;
    this.movieResults = [];
    this.movieKeyword = '';
  }

  clearMovie() {
    this.selectedMovie = null;
  }
  resetForm() {
    this.title = '';
    this.description = '';
    this.startDate = '';
    this.endDate = '';
    this.selectedMovie = null;
  }


  create() {
    if (!this.title || !this.startDate) return;

    const movieId =
      this.selectedMovie?.tmdbMovieId ?? this.selectedMovie?.id ?? null;

    const mediaType =
      this.selectedMovie?.mediaType ?? this.selectedMovie?.media_type ?? null;

    this.community.createEvent({
      title: this.title,
      description: this.description,
      startDate: new Date(this.startDate).toISOString(),
      endDate: this.endDate ? new Date(this.endDate).toISOString() : null,
      movieId,
      mediaType
    }).subscribe({
      next: () => {
        this.refresh.emit();
        this.title = '';
        this.description = '';
        this.startDate = '';
        this.endDate = '';
        this.selectedMovie = null;
      },
      error: err => {
        console.error(err);
        alert('สร้างกิจกรรมไม่สำเร็จ');
      }
    });
  }
  onEdit(e: any) {
    this.editingEvent = e;

    this.title = e.Title || e.title;
    this.description = e.Description || e.description;
    this.startDate = (e.StartDate || e.startDate)?.slice(0, 10);
    this.endDate = (e.EndDate || e.endDate)?.slice(0, 10);
  }
  update() {
  if (!this.editingEvent) return;

  const id = this.editingEvent.Id ?? this.editingEvent.id;

  const movieId =
    this.selectedMovie?.tmdbMovieId ??
    this.editingEvent.Movie?.TmdbMovieId ??
    null;

  const mediaType =
    this.selectedMovie?.mediaType ??
    this.editingEvent.MediaType ??
    null;

  this.community.updateEvent(id, {
    title: this.title,
    description: this.description,
    startDate: new Date(this.startDate).toISOString(),
    endDate: this.endDate ? new Date(this.endDate).toISOString() : null,
    movieId,
    mediaType
  }).subscribe({
    next: () => {
      this.refresh.emit(true);


      this.editingEvent = null;
      this.resetForm();
    },
    error: err => {
      console.error(err);
      alert('แก้ไขกิจกรรมไม่สำเร็จ');
    }
  });
}

  delete(id: number) {
    if (!confirm('ลบกิจกรรมนี้?')) return;

    this.community.deleteEvent(id)
      .subscribe(() => {
        this.events = this.events.filter(e => e.id !== id);
      });
  }

  getPoster(path: string | null) {
    return path
      ? 'https://image.tmdb.org/t/p/w200' + path
      : 'assets/no-poster.png';
  }
}

