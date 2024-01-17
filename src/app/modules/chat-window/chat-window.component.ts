import { DomSanitizer } from '@angular/platform-browser';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChatService } from '../services/chat.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnInit, OnChanges {
  @Input() currentChatUser: any;
  @Output() videoCallInit = new EventEmitter();

  public dialogRef!: MatDialogRef<VideoComponent>;

  loginUser: any;
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    public sanitizer: DomSanitizer,
    private socketService: SocketService,
    private authService: AuthService,
    private chatService: ChatService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loginUser = this.authService.activeUserDetails();
    this.receivedMessage();
  }

  ngOnChanges(): void{
    this.newMessage = '';
    this.getChatHistory();
  }

  sendMessage() {
    const messageObj = {
      fromUser: this.loginUser?._id,
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

  startVideoCall(currentChatUser: any, loginUser: any) {
    this.dialogRef = this.dialog.open(VideoComponent, {
      width: '500px',
      height: '300px',
      disableClose: true,
      data: {
        isCaller: true,
        callerDetails: { ...loginUser },
        isReceiver: false,
        receiverDetails: { ...currentChatUser },
      },
    });

    this.socketService.emit('callInit', {
      fromUser: { ...loginUser },
      toUser: { ...currentChatUser },
    });

    this.callendFromReciver();

    this.dialogRef.afterClosed().subscribe((result) => {});
  }

  // call end/cancel from reciver
  callendFromReciver(){
    this.socketService.listen('callendFromReceiverEmit').subscribe((data: any) => {
      if(data.callend){
        this.dialogRef.close();
      }
    })
  }
}
