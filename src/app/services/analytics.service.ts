import { Injectable } from '@angular/core';
import { getAnalytics, logEvent } from 'firebase/analytics';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private analytics = getAnalytics();

  log(eventName: string, params?: any) {
    logEvent(this.analytics, eventName, params);
  }
}
