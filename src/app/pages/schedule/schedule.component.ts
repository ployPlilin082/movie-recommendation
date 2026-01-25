import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService, ScheduleItem } from '../../services/schedule.service';
import { MovieService, MovieItem } from '../../services/movie.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {

  tmdbImageBase = 'https://image.tmdb.org/t/p/w200';

  schedules: ScheduleItem[] = [];
  movies: MovieItem[] = [];

  editingScheduleId?: number;

  activeRange: 'today' | 'tomorrow' | 'week' | 'month' = 'today';
  ranges: Array<'today' | 'tomorrow' | 'week' | 'month'> = [
    'today', 'tomorrow', 'week', 'month'
  ];

  

  showModal = false;
  searchText = '';
  selectedMovie?: MovieItem;
  newDateTime = '';

  constructor(
    private scheduleService: ScheduleService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.loadSchedules();
    this.loadMovies();
  }

  /* =======================
     LOAD DATA
  ======================= */

loadSchedules() {
  this.scheduleService
    .getSchedules(this.activeRange)
    .subscribe(r => {
      this.schedules = r.map(s => {
        const movie = this.movies.find(m => m.tmdbMovieId === s.movieId);

        return {
          ...s,
          movieTitle: movie?.title,
          posterPath: movie?.posterPath,
          mediaType: movie?.mediaType ?? 'movie'
        };
      });
    });
}

  loadMovies() {
  this.movieService.getCachedMovies().subscribe(r => {
    this.movies = r.map(m => ({
      ...m,
      mediaType:
        m.mediaType === 'movie'
          ? 'movie'
          : 'tv' 
    }));
  });
  
}


  changeRange(range: 'today' | 'tomorrow' | 'week' | 'month') {
    this.activeRange = range;
    this.loadSchedules();
  }

  /* =======================
     EDIT
  ======================= */

 editSchedule(s: ScheduleItem) {
  this.editingScheduleId = s.scheduleId;
  this.newDateTime = this.toLocalDateTime(s.dateTimeScheduled);


  this.selectedMovie = this.movies.find(
    m => m.tmdbMovieId === s.movieId
  );

  this.showModal = true;
}


  /* =======================
     CREATE / UPDATE
  ======================= */

  saveSchedule() {
  if (!this.selectedMovie || !this.newDateTime) return;

  const mediaType: 'movie' | 'tv' =
    this.selectedMovie.mediaType === 'movie' ? 'movie' : 'tv';

  const payload = {
    movieId: this.selectedMovie.tmdbMovieId,
    mediaType,
    dateTimeScheduled: this.newDateTime
  };

  if (this.editingScheduleId) {
    this.scheduleService
      .updateSchedule(this.editingScheduleId, payload)
      .subscribe(() => this.afterSave());
    return;
  }

  this.scheduleService
    .createSchedule(payload)
    .subscribe(() => this.afterSave());
}


  afterSave() {
    this.closeModal();
    this.editingScheduleId = undefined;
    this.loadSchedules();
  }

  /* =======================
     DELETE
  ======================= */

  deleteSchedule(id: number) {
    this.scheduleService
      .deleteSchedule(id)
      .subscribe(() => {
        this.schedules = this.schedules.filter(s => s.scheduleId !== id);
      });
  }

  /* =======================
     MODAL / UI
  ======================= */

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.searchText = '';
    this.selectedMovie = undefined;
    this.newDateTime = '';
  }

  filteredMovies() {
    return this.movies.filter(m =>
      m.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectMovie(m: MovieItem) {
    this.selectedMovie = m;
  }

  /* =======================
     TIME FIX
  ======================= */

  toLocalDateTime(date: string) {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }
}
