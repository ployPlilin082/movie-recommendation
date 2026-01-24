import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth/auth.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserHistoryService } from '../../services/๊userhistory.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  roomId = 'movie_550';
  movieId = 550;
  messages: ChatMessage[] = [];
  input = '';

  constructor(
    private auth: AuthService,
    private chat: ChatService,
    private router: Router,
    private analytics: AnalyticsService,
    private userHistoryService: UserHistoryService
  ) {}

  ngOnInit() {
    this.chat.getMessages(this.roomId).subscribe(res => {
      this.messages = res.map(m => ({
        ...m,
        movies: m.moviesJson ? JSON.parse(m.moviesJson) : undefined
      }));
    });
  }

  openMovie(id: number, mediaType: 'movie' | 'tv' = 'movie') {

    this.analytics.log('open_movie', { movie_id: id, mediaType });

    this.userHistoryService.log({
      movieId: id,
      interactionTypeId: 2
    }).subscribe({
      next: () => {
        this.router.navigate(
          ['/movie', id],
          { queryParams: { mediaType } }
        );
      },
      error: (err: any) => {
        console.error('log failed', err);
        this.router.navigate(
          ['/movie', id],
          { queryParams: { mediaType } }
        );
      }
    });
  }
   send() {
  if (!this.input.trim()) return;

  this.chat.sendMessage({
    roomId: this.roomId,
    movieId: this.movieId,
    message: this.input
  }).subscribe(res => {

    const mappedMessages: ChatMessage[] = [
      res.userMessage,
      {
        ...res.aiMessage,
        movies: res.aiMessage.moviesJson
          ? JSON.parse(res.aiMessage.moviesJson)
          : undefined
      }
    ];

    this.messages = [...this.messages, ...mappedMessages];
  });

  this.input = '';
}

}
