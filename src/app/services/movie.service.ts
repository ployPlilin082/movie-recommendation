import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { environment } from '../../environmemts/environment';



export interface MyListMovie {
  id: number;
  title: string;
  poster_path: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
   media_type?: 'movie' | 'tv';
}
export interface MovieItem {
  tmdbMovieId: number;
  title: string;
  posterPath?: string;
  platform?: string;
}

export interface ListResponse<T> {
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class MovieService {

 private apiBase = environment.apiBaseUrl +'/api';


  constructor(private http: HttpClient) {}

  // =========================
  // เรียกผ่าน Backend (มันจะไป TMDB แล้ว cache ลง Mongo)
  // =========================

  getTrendingMovies(page: number = 1): Observable<MyListMovie[]> {
    return this.http.get<MyListMovie[]>(`${this.apiBase}/movies/trending?page=${page}`);
  }
  

  getMovieDetail(id: string | null): Observable<any> {
    if (!id) throw new Error('tmdbId is required');
    return this.http.get<any>(`${this.apiBase}/movies/${id}`);
  }

  getUpNextMovies(page: number = 1): Observable<MyListMovie[]> {
    return this.http.get<MyListMovie[]>(`${this.apiBase}/movies/now-playing?page=${page}`);
  }
getPopularPeople(page: number = 1) {
  return this.http.get<any>(`${this.apiBase}/movies/people/popular?page=${page}`);
}

  getPopularMoviesThisWeek(page: number = 1): Observable<MyListMovie[]> {
    return this.http.get<MyListMovie[]>(`${this.apiBase}/movies/trending?page=${page}`);
  }
  getCachedMovies(): Observable<MovieItem[]> {
  return this.http.get<MovieItem[]>(
    `${this.apiBase}/movies/cached`
  );
}


  getGenres() {
  return this.http.get<any>(`${this.apiBase}/movies/genres`);
}

 getTopPicks(page: number = 1) {
  return this.http.get<MyListMovie[]>(`${this.apiBase}/movies/top-picks?page=${page}`);
}

getMoviesByGenre(genreId: number, page: number = 1) {
  return this.http.get<any>(
    `${this.apiBase}/movies/by-genre/${genreId}?page=${page}`
  );
}
getVideos(id: number, mediaType: string = 'movie') {
  return this.http.get<any>(`${this.apiBase}/movies/${id}/videos?mediaType=${mediaType}`);
}
getFeatured(page = 1): Observable<ListResponse<MyListMovie>> {
  return this.http.get<ListResponse<MyListMovie>>(
    `${this.apiBase}/movies/featured?page=${page}`
  );
}
likeMovie(tmdbId: number) {
  return this.http.post<any>(
    `${this.apiBase}/movies/${tmdbId}/like`,
    {}
  );
}

shareMovie(tmdbId: number) {
  return this.http.post(
    `${this.apiBase}/movies/${tmdbId}/share`,
    {}
  );
}
searchMovies(query: string) {
  return this.http.get<any[]>(
    `${this.apiBase}/movies/search?q=${encodeURIComponent(query)}`
  );
}





}
