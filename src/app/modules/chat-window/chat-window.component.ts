import { DomSanitizer } from '@angular/platform-browser';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnInit {
  @Input() currentChatUser: any;
  @Output() videoCallInit = new EventEmitter();
  activeUser: any;
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    public sanitizer: DomSanitizer,
    private socketService: SocketService,
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.activeUser = this.authService.activeUserDetails();
    this.receivedMessage();
    this.getChatHistory();
  }

  sendMessage() {
    const messageObj = {
      fromUser: this.activeUser?._id,
      toUser: this.currentChatUser?._id,
      message: this.newMessage,
    };

    if (this.newMessage?.trim() == '') {
      return;
    }

    this.messages.push(messageObj);
    this.socketService.emit('sendMessage', messageObj);
    this.newMessage = '';
    const value = document.getElementById('focus');
    value?.focus();
  }

  receivedMessage() {
    this.socketService.listen('receiveMessage').subscribe((data: any) => {
      this.messages.push(data);
    });
  }

  getChatHistory() {
    this.chatService
      .getChatHistory(this.currentChatUser._id)
      .subscribe((data: any) => {
        if (data.status) {
          this.messages = data.data;
        } else {
          this.messages = [];
        }
      });
  }

  startVideoCall(currentChatUser: any) {
    this.videoCallInit.emit(currentChatUser);
  }


}
