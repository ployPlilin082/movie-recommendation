import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


export interface MyListMovie {
  id: number;
  title: string;
  poster_path: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
}
@Injectable({
  providedIn: 'root'
})
export class MovieService {
getMovieDetail(id: string | null): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=credits`
  );
}


  private apiKey = 'a8033b63db6be15159a6c64b85d013b4';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  //  Trending - ใช้สำหรับ main movie + featured
  getTrendingMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}`);
  }

  //  Up next  
  getUpNextMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}`);
  }

  //  Celebrities  
  getPopularPeople(): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/popular?api_key=${this.apiKey}`);
  }

  //  Popular movies this week (ใช้ 10 อันดับ)
  getPopularMoviesThisWeek(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}`);
  }

  //  Popular interests - Genres
  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`);
  }

  //  What to watch (Top picks) = ใช้ popular movies
  getTopPicks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}`);
  }
getMoviesByGenre(genreId: number, page: number = 1) {
  return this.http.get<any>(
    `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&page=${page}`
  );
}
private myListSubject = new BehaviorSubject<any[]>(this.loadFromStorage());
  myList$ = this.myListSubject.asObservable();

  private loadFromStorage(): any[] {
    const saved = localStorage.getItem('myList');
    return saved ? JSON.parse(saved) : [];
  }

  private save(list: any[]) {
    localStorage.setItem('myList', JSON.stringify(list));
    this.myListSubject.next(list);
  }

  toggleMyList(movie: any) {
    const exists = this.myListSubject.value.some(m => m.id === movie.id);
    const updated = exists
      ? this.myListSubject.value.filter(m => m.id !== movie.id)
      : [...this.myListSubject.value, movie];

    this.save(updated);
  }
}


 



