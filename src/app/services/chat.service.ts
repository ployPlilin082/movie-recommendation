import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environmemts/environment';


export interface ChatMessage {
  id?: number;
  roomId: string;
  movieId: number;
  userId?: number | null;
  displayName: string;
  sender: 'user' | 'bot';
  messageType?: 'text' | 'movies';
  message?: string;
  moviesJson?: string;      // 👈 เพิ่ม
  movies?: AiMovie[];       // 👈 ใช้แสดงผล
}

export interface SendChatPayload {
  roomId: string;
  movieId: number;
  message: string;
}
export interface AiMovie {
  tmdbId: number;
  title: string;
  year: string;
  overview: string;
  posterUrl: string;
}
export interface SendChatResponse {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
}


@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = environment.apiBaseUrl +'/api/ChatAi';

  constructor(private http: HttpClient) {}

  getMessages(roomId: string) {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/${roomId}`);
  }

  // แก้ตรงนี้
  sendMessage(payload: SendChatPayload) {
  return this.http.post<SendChatResponse>(
    this.baseUrl,
    payload
  );
}

}
