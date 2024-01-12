import { SocketService } from 'src/app/services/socket.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('userVideoRef') userVideo!: ElementRef<any>;
  @ViewChild('peerVideoRef') peerVideo!: ElementRef<any>;

  isCaller!: boolean;
  callerDetails: any;
  isReceiver!: boolean;
  receiverDetails: any;
  isReceiverPickupCalled: boolean = false;

  public videoStream!: MediaStream;

  public getUserMediaNotSupport: boolean = false;
  public showVideo: boolean = true;

  // peer connection declaration
  private rtcPeerConnection!: RTCPeerConnection;

  // ice server's
  iceServers = {
    iceServers: [
      { urls: 'stun:stun.services.mozilla.com' },
      { urls: 'stun:stun.l.google.com:19302' },
    ],
  };

  constructor(
    public sanitizer: DomSanitizer,
    private socketService: SocketService,
    public dialogRef: MatDialogRef<VideoComponent>,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isCaller = this.data.isCaller;
      this.callerDetails = this.data.callerDetails;
      this.isReceiver = this.data.isReceiver;
      this.receiverDetails = this.data.receiverDetails;
    }
  }

  ngAfterViewInit(): void {
    if (this.isCaller) {
      this.receiverPickupCallListen();
    }
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
          video: this.showVideo ? true : false,
        })
        .then((stream: MediaStream) => {
          const userVideoElemet: HTMLVideoElement =
            this.userVideo.nativeElement;

          // Assign the stream to the video element
          userVideoElemet.srcObject = stream;

          // Play the video
          userVideoElemet.play();

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

  getReceiverMedia() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: this.showVideo ? true : false,
        })
        .then((stream: MediaStream) => {
          const peerVideoElemet: HTMLVideoElement =
            this.peerVideo.nativeElement;

          // Assign the stream to the video element
          peerVideoElemet.srcObject = stream;

          // Play the video
          peerVideoElemet.play();

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

  // caller end the call
  callerCutCall() {
    this.socketService.emit('callendFromCaller', {
      callend: true,
      fromUser: this.callerDetails,
      toUser: this.receiverDetails,
    });
    this.dialogRef.close();
  }

  // receiver cut the call
  receiverCutCall() {
    this.socketService.emit('callendFromReceiver', {
      callend: true,
      fromUser: this.receiverDetails,
      toUser: this.callerDetails,
    });
    this.dialogRef.close();
  }

  // receiver pickup the call
  receiverPickupCall() {
    this.isReceiverPickupCalled = true;
    this.socketService.emit('receiverPickUpCall', {
      fromUser: this.receiverDetails,
      toUser: this.callerDetails,
    });

    // get media of caller user
    this.getReceiverMedia();
  }

  // caller listen reveiverPick a call
  receiverPickupCallListen() {
    this.socketService
      .listen('receiverPickUpCallEmit')
      .subscribe((data: any) => {
        this.isReceiverPickupCalled = true;
        this.cd.detectChanges();

        // get media of receiver user
        this.getUserMedia();
      });
  }

  connectionReadyFun() {
    this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
    this.rtcPeerConnection.onicecandidate = (event) => {
      //
    };
    this.rtcPeerConnection.ontrack = () => {
      //
    };
    this.rtcPeerConnection.addTrack(
      this.videoStream.getTracks()[0],
      this.videoStream
    );
    this.rtcPeerConnection.addTrack(
      this.videoStream.getTracks()[1],
      this.videoStream
    );
  }

  ngOnDestroy(): void {}
}
