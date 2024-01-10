import { SocketService } from 'src/app/services/socket.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
  @Output() callEnded = new EventEmitter<boolean>();
  private videoStream!: MediaStream;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getUserMedia();
  }

  getUserMedia() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: { width: 100, height: 100 } })
        // .getUserMedia({ audio: true, video: false })
        .then((stream: MediaStream) => {
          const userVideoElemet: HTMLVideoElement =
            this.userVideo.nativeElement;

          // Assign the stream to the video element
          userVideoElemet.srcObject = stream;

          // Play the video
          userVideoElemet.play();

          // Save the stream reference for later use
          this.videoStream = stream;
        })
        .catch((error: any) => {
          console.log('Error accessing webcam:', error);
        });
    } else {
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
