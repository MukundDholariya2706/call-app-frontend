import { SocketService } from 'src/app/services/socket.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
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

  // Peer connection declaration
  private rtcPeerConnection!: RTCPeerConnection;

  // Ice server's
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
      this.isReceiverPickupTheCallListen();
    }
    this.listenCandidateEvent();
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

          this.videoStream = stream;

          // Play the video
          userVideoElemet.play();

          // enable connection
          this.setupConnection();
        })
        .catch((error: any) => {
          console.log('Error accessing webcam:', error);
        });
    } else {
      this.getUserMediaNotSupport = true;
      console.error('getUserMedia is not supported in this browser');
    }
  }

  // get receiver video and audio access from browser
  getReceiverMedia(): void {
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

          this.videoStream = stream;

          // Play the video
          userVideoElemet.play();

          this.setupConnection();
          this.listenOfferEvent();
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

  // cancel video stream when call is ended
  cancelVideoStream() {
    if (this.videoStream) {
      this.videoStream
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      (this.userVideo.nativeElement as HTMLVideoElement).srcObject = null;
    }
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

  // caller listen reveiverPick a call - creater
  isReceiverPickupTheCallListen() {
    this.socketService
      .listen('receiverPickUpCallEmit')
      .subscribe(async (data: any) => {
        this.isReceiverPickupCalled = true;

        // get media of receiver user
        this.getUserMedia();
      });
  }

  // caller / receciver side use function for create connection
  async setupConnection() {
    this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
    this.rtcPeerConnection.onicecandidate = (
      event: RTCPeerConnectionIceEvent
    ) => {
      if (event.candidate) {
        const eventObj = {
          candidate: event.candidate,
          fromUser: this.isCaller ? this.callerDetails : this.receiverDetails,
          toUser: this.isCaller ? this.receiverDetails : this.callerDetails,
        };

        this.socketService.emit('candidate', eventObj);
      }
    };

    this.rtcPeerConnection.ontrack = (event: RTCTrackEvent) => {
      const peerVideoElement: HTMLVideoElement = this.peerVideo.nativeElement;

      peerVideoElement.srcObject = event.streams[0];
      peerVideoElement.onloadedmetadata = (e) => {
        peerVideoElement.play();
      };
    };

    this.rtcPeerConnection.addTrack(
      this.videoStream.getTracks()?.[0],
      this.videoStream
    );
    this.rtcPeerConnection.addTrack(
      this.videoStream.getTracks()?.[1],
      this.videoStream
    );

    if (this.isCaller) {
      this.createRTCofferFun();
    }

    // listen for answer event
    this.listenAnswerEvent();
  }

  // create RTC offer
  async createRTCofferFun() {
    this.rtcPeerConnection
      .createOffer()
      .then((offer: RTCSessionDescriptionInit) => {
        this.rtcPeerConnection.setLocalDescription(offer);
        const emitData = {
          fromUser: this.callerDetails,
          toUser: this.receiverDetails,
          offer: offer,
        };

        this.socketService.emit('offer', emitData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // create RTC answer
  createRTCanswerFun(offer: any) {
    this.rtcPeerConnection.setRemoteDescription(offer);
    this.rtcPeerConnection
      .createAnswer()
      .then((answer: RTCSessionDescriptionInit) => {
        this.rtcPeerConnection.setLocalDescription(answer);

        const eventObj = {
          fromUser: this.receiverDetails,
          toUser: this.callerDetails,
          answer: answer,
        };
        this.socketService.emit('answer', eventObj);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  listenCandidateEvent() {
    this.socketService.listen('candidate').subscribe((candidate: any) => {
      let icecandidate = new RTCIceCandidate(candidate);
      this.rtcPeerConnection.addIceCandidate(icecandidate);
    });
  }

  listenOfferEvent() {
    this.socketService.listen('offer').subscribe((offer: any) => {
      this.createRTCanswerFun(offer);
    });
  }

  listenAnswerEvent() {
    this.socketService.listen('answer').subscribe((answer: any) => {
      this.rtcPeerConnection.setRemoteDescription(answer);
    });
  }

  ngOnDestroy(): void {
    this.cancelVideoStream();
  }
}
