import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environmemts/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private apiUrl = environment.apiBaseUrl +'/api/recommendations';
  // หรือใช้ environment.apiUrl

  constructor(private http: HttpClient) {}

  getRecommendations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
