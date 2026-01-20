import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environmemts/environment';



@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private baseUrl = environment.apiBaseUrl +'/api/Playlist';

  constructor(private http: HttpClient) {}


  getMyPlaylist(): Observable<{ playlistId: number; name: string }> {
    return this.http.get<{ playlistId: number; name: string }>(`${this.baseUrl}/my`);
  }


  getMyItems(): Observable<{ items: any[] }> {
    return this.http.get<{ items: any[] }>(`${this.baseUrl}/my/items`);
  }


  addMyItem(movie: any): Observable<any> {
    const movieId = movie?.id ?? movie?.movieId;
    return this.http.post<any>(`${this.baseUrl}/my/items`, { movieId });
  }


  removeMyItem(movieId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/my/items/${movieId}`);
  }
}
