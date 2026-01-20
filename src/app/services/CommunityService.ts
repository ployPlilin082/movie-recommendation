import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environmemts/environment';


/* =======================
   Interfaces
======================= */

export interface CommunityPost {
  postId: number;

  movieId: number | null;
  movieTitle: string | null;
  posterPath: string | null;
  userId: number;
  userName: string;

  comment: string;
  rating: number | null;
  createdAt: string;

  likeCount: number;
  shareCount: number;
  isLikedByMe: boolean;
}



export interface TopMovie {
  tmdbMovieId: number;
  title: string;
  score: number;
}

export interface MoviePick {
  tmdbMovieId: number;
  title: string;
  posterPath?: string | null;
}

export interface ReviewComment {
  id: number;
  reviewId: number;
  username: string;
  text: string;
  createdAt: string;
}

export interface Discussion {
  id: number;
  text: string;
  createdAt: string;
  username?: string;
}

export interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

/* =======================
   API DTO
======================= */

type TopMovieApi = {
  movieId: number;
  avgScore: number;
  title: string | null;
};

/* =======================
   Service
======================= */

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private baseUrl = environment.apiBaseUrl +'/api/community';

  constructor(private http: HttpClient) {}

  /* ---------- POSTS ---------- */

  getPosts(take = 20): Observable<CommunityPost[]> {
    return this.http.get<CommunityPost[]>(
      `${this.baseUrl}/posts?take=${take}`
    );
  }

  postReview(body: {
    movieId: number;
    comment: string;
    rating: number;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/post-review`,
      body
    );
  }

  /* ---------- TOP MOVIES ---------- */

  getTopMovies(take = 3): Observable<TopMovie[]> {
    return this.http
      .get<TopMovieApi[]>(`${this.baseUrl}/top-movies?take=${take}`)
      .pipe(
        map(rows =>
          rows.map(r => ({
            tmdbMovieId: r.movieId,
            title: r.title ?? '(unknown)',
            score: r.avgScore
          }))
        )
      );
  }

  /* ---------- REVIEW ACTIONS ---------- */

  likeReview(reviewId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reviews/${reviewId}/like`,
      {}
    );
  }

  addReviewComment(
    reviewId: number,
    text: string
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reviews/${reviewId}/comments`,
      { text }
    );
  }

  getReviewComments(
    reviewId: number
  ): Observable<ReviewComment[]> {
    return this.http.get<ReviewComment[]>(
      `${this.baseUrl}/reviews/${reviewId}/comment`
    );
  }

  shareReview(reviewId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reviews/${reviewId}/share`,
      {}
    );
  }

  /* ---------- DISCUSSIONS ---------- */

  createDiscussion(text: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/discussions`,
      { text }
    );
  }

  getDiscussions(take = 20): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(
      `${this.baseUrl}/discussions?take=${take}`
    );
  }

  /* ---------- EVENTS ---------- */

  createEvent(params: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/events`,
      null,
      { params }
    );
  }
  getEvents(take = 20) {
  return this.http.get<any[]>(
    `${this.baseUrl}/events?take=${take}`
  );
}


  /* ---------- MOVIES ---------- */

  searchMovies(
    q: string,
    take = 10
  ): Observable<MoviePick[]> {
    return this.http.get<MoviePick[]>(
      `${this.baseUrl}/movies/search?q=${encodeURIComponent(q)}&take=${take}`
    );
  }

  getMovie(tmdbId: number): Observable<MoviePick> {
    return this.http.get<MoviePick>(
      `${this.baseUrl}/movie/${tmdbId}`
    );
  }
}
