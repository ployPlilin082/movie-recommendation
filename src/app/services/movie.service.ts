import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'a8033b63db6be15159a6c64b85d013b4';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getTrendingMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}&language=en-US`);
  }

  getPopularPeople(): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/popular?api_key=${this.apiKey}&language=en-US`);
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=videos`);
  }
}
