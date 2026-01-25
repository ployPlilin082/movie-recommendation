import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environmemts/environment';

/* ============================
   Models / Interfaces
============================ */

export interface ScheduleItem {
  scheduleId: number;
  dateTimeScheduled: string;

  mediaType?: 'movie' | 'tv';

  movieId: number;
  movieTitle?: string;
  posterPath?: string;
  platform?: string;
}

export interface CreateScheduleRequest {
  movieId: number;
  dateTimeScheduled: string;
  mediaType?: 'movie' | 'tv';
  status?: string;
}

export interface UpdateScheduleRequest {
  movieId: number;
  dateTimeScheduled: string;
  status?: string;
  mediaType?: 'movie' | 'tv';
  updateBy?: string;
}

/* ============================
   Service
============================ */

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private readonly apiUrl = environment.apiBaseUrl +'/api/Schedule';
  // 🔁 เปลี่ยนเป็น base url จริงตอน deploy

  constructor(private http: HttpClient) {}

  /* ============================
     GET : ดึงตารางดูหนัง
  ============================ */
  getSchedules(
  range: 'today' | 'tomorrow' | 'week' | 'month'
): Observable<ScheduleItem[]> {
  return this.http.get<ScheduleItem[]>(
    `${this.apiUrl}?range=${range}`
  );
}


  /* ============================
     POST : เพิ่ม Schedule
  ============================ */
  createSchedule(data: CreateScheduleRequest) {
  return this.http.post(this.apiUrl, data);
}


  /* ============================
     PUT : แก้ไข Schedule
  ============================ */
  updateSchedule(
    scheduleId: number,
    payload: UpdateScheduleRequest
  ): Observable<ScheduleItem> {
    return this.http.put<ScheduleItem>(
      `${this.apiUrl}/${scheduleId}`,
      payload
    );
  }

  /* ============================
     DELETE : ลบ Schedule
  ============================ */
  deleteSchedule(
    scheduleId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${scheduleId}`
    );
  }
}
