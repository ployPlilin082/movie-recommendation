import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environmemts/environment';



@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = environment.apiBaseUrl +'/api/profile';

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get<{
      myLists: number;
      ratings: number;
      watched: number;
    }>(`${this.baseUrl}/stats`);
  }
}
