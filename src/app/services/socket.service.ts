import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket!: Socket;

  constructor() {}

  startSocket() {
    if (!this.socket || (this.socket && !this.socket.connected)) {
      this.socket = io(environment.socketUrl);
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
