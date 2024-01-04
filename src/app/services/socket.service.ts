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

  constructor(private authService: AuthService) {}

  startSocket() {
    console.log(environment.socketUrl, 'environment.socketUrl');
    this.user = this.authService.activeUserDetails();

    if (!this.socket || (this.socket && !this.socket.connected)) {
      this.socket = io(environment.socketUrl, {
        transports: ['websocket'],
      });
      this.socket.emit('room', {
        id: this.user._id,
      });
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
}
