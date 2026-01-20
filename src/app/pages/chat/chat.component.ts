import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth/auth.service';

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
    private chat: ChatService
  ) { }

  // ✅ แก้ Error OnInit
  ngOnInit() {
  this.chat.getMessages(this.roomId).subscribe(res => {
    this.messages = res.map(m => ({
      ...m,
      movies: m.moviesJson
        ? JSON.parse(m.moviesJson)
        : undefined
    }));
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


  goMovie(tmdbId: number) {
    window.location.href = `/movie/${tmdbId}`;
  }

}



