import { LocalstorageService } from './localstorage.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket!: Socket;
  public user: any;

  constructor(private localstorageService: LocalstorageService) {}

  startSocket() {
    this.user = this.localstorageService.getLocalStore('user');

    if (!this.socket || (this.socket && !this.socket.connected)) {
      this.socket = io(environment.socketUrl);
      this.socket.emit('room', {
        id: this.user._id,
      });

      this.putOnlineStatus();
    }
  }

  listen(eventName: string) {
    return new Observable((observer: any) => {
      this.socket.on(eventName, (msg: any) => {
        observer.next(msg);
      });
    });
  }

  emit(eventName: string, data?: any) {
    this.socket.emit(eventName, data);
  }

  closeSocket() {
    this.socket.close();
  }

  putOnlineStatus() {
    if (this.user) {
      this.socket.emit('userConnect', { ...this.user, isOnline: true });
    }
  }

  putOfflineStatus() {
    if (this.user) {
      this.socket.emit('userDisconnect', { ...this.user, isOnline: false });
    }
  }
}
