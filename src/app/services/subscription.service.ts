import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environmemts/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {

  private apiBase = environment.apiBaseUrl +'/api/Calculate'; 

  constructor(private http: HttpClient) {}

  getPlatforms() {
    return this.http.get<any[]>(`${this.apiBase}/platform`);
  }

  getPlans() {
    return this.http.get<any[]>(`${this.apiBase}/plan`);
  }

  calculate(payload: {
    platformId: number;
    planId?: number;
    price: number;
    currency: string;
    isDelete?: boolean;
  }) {
    return this.http.post(`${this.apiBase}/calculate`, payload);
  }

  getHistory() {
    return this.http.get<any[]>(`${this.apiBase}/history`);
  }
}



