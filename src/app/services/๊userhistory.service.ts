import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environmemts/environment';



@Injectable({ providedIn: 'root' })
export class UserHistoryService {
  private baseUrl = environment.apiBaseUrl +'/api/user-history';

  constructor(private http: HttpClient) {}

  log(data: {
    movieId?: number;
    interactionTypeId: number;
    durationWatched?: number;
  }): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}


