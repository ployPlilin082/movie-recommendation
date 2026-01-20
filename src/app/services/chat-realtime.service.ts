import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { realtimeDb } from '../../../firebase';
import {
  ref,
  push,
  onChildAdded,
  query,
  orderByChild,
  limitToLast
} from 'firebase/database';
import { ChatMessage } from './chat.service';

@Injectable({ providedIn: 'root' })
export class ChatRealtimeService {

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

 listen(roomId: string) {
  const messagesRef = query(
    ref(realtimeDb, `chatRooms/${roomId}/messages`),
    orderByChild('timestamp'),
    limitToLast(50)
  );

  const buffer: ChatMessage[] = [];

  onChildAdded(messagesRef, snapshot => {
    buffer.push({
      id: snapshot.key,     
      ...snapshot.val()
    });
    this.messagesSubject.next([...buffer]);
  });
}
  send(roomId: string, msg: ChatMessage) {
    const messagesRef = ref(
      realtimeDb,
      `chatRooms/${roomId}/messages`
    );

    return push(messagesRef, {
      ...msg,
      timestamp: Date.now()
    });
  }

  
}
