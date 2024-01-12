import { SocketService } from 'src/app/services/socket.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('userVideoRef') userVideo!: ElementRef<any>;
  @ViewChild('peerVideoRef') peerVideo!: ElementRef<any>;

  @Input() activeUser: any;
  @Input() currentChatUser!: any;
  @Input() isCaller!: boolean;
  @Output() callEnded = new EventEmitter<boolean>();

  public videoStream!: MediaStream;
  public getUserMediaNotSupport: boolean = false;
  public showVideo: boolean = true;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // if(this.isCaller){
    this.getUserMedia();
    // }
  }

  // get peer video and audio
  getPeerMedia(stream: any) {
    const peerVideoElemet: HTMLVideoElement = this.peerVideo.nativeElement;
    peerVideoElemet.srcObject = stream;
    peerVideoElemet.play();
  }

  // get user video and audio access from browser
  getUserMedia(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: this.showVideo ? { width: 100, height: 100 } : false,
        })
        .then((stream: MediaStream) => {
          const userVideoElemet: HTMLVideoElement =
            this.userVideo.nativeElement;

          // Assign the stream to the video element
          userVideoElemet.srcObject = stream;

          // Play the video
          userVideoElemet.play();

          // trigger event to send user is ready
          this.socketService.emit('ready', {
            reciverUser: this.currentChatUser?._id,
            callerUser: this.activeUser._id,
          });

          // Save the stream reference for later use
          this.videoStream = stream;
        })
        .catch((error: any) => {
          console.log('Error accessing webcam:', error);
        });
    } else {
      this.getUserMediaNotSupport = true;
      console.error('getUserMedia is not supported in this browser');
    }
  }

  hangUpCall(): void {
    if (this.videoStream) {
      // stop the stream tracks
      this.videoStream.getTracks().forEach((track) => track.stop());
      (this.userVideo.nativeElement as HTMLVideoElement).srcObject = null;
      this.callEnded.emit(true);
    }
  }

  ngOnDestroy(): void {}
}
