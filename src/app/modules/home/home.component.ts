import { VideoComponent } from './../video/video.component';
import { SocketService } from './../../services/socket.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild(VideoComponent, { static: false }) videoComponent!: VideoComponent;
  @ViewChild('peerRef') peerVideo!: ElementRef<any>;

  public isCaller: boolean = true;
  public activeUser: any;
  public contacts: any[] = [];
  public currentChatUser: any;
  public dialogRef!: MatDialogRef<VideoComponent>;

  // stun server list
  private iceServers = {
    iceServers: [
      {
        urls: 'stun:stun.services.mozilla.com',
      },
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private socketService: SocketService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activeUser = this.authService.activeUserDetails();

    if (this.activeUser) {
      // this.socketService.startSocket();
      this.listenAnyOneIsCalling();
    }

    this.userService.getAllUserList().subscribe((res: any) => {
      if (res.status) {
        this.contacts = res.data;
      }
    });
  }

  listenAnyOneIsCalling() {
    this.socketService.listen('anyOneCalling').subscribe((data: any) => {
      console.log(data, 'anyonecalling');

      this.callEndByCaller();

      this.dialogRef = this.dialog.open(VideoComponent, {
        width: '500px',
        height: '300px',
        disableClose: true,
        data: {
          isCaller: false,
          callerDetails: { ...data.callerDetails },
          isReceiver: true,
          receiverDetails: { ...data.receiverDetails },
        },
      });
    });
  }

  // call end/cancel from caller
  callEndByCaller() {
    this.socketService
      .listen('callendFromCallerEmit')
      .subscribe((data: any) => {
        if (data.callend) {
          this.dialogRef.close();
        }
      });
  }

  handleChatChange(event: any) {
    this.currentChatUser = event;
  }

  ngAfterViewInit(): void {}
}
