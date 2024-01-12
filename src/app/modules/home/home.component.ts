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
  public showCallScreen: boolean = false;

  // rtc-peer-server
  private rtcPeerConnection!: RTCPeerConnection;

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
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.activeUser = this.authService.activeUserDetails();
    
    if(this.activeUser){
      this.socketService.startSocket();
    }

    this.userService.getAllUserList().subscribe((res: any) => {
      if (res.status) {
        this.contacts = res.data;
      }
    });
  }

  handleChatChange(event: any) {
    this.currentChatUser = event;
    this.showCallScreen = false;
  }

  videoCallInit(event: any) {
    this.showCallScreen = true;
  }

  callEnded(event: any) {
    if (event) {
      this.showCallScreen = false;
    }
  }

  ngAfterViewInit(): void {
    this.socketListenEvent();
  }

  // listen event for call
  socketListenEvent() {
    this.socketService.listen('ready').subscribe((response: any) => {
      this.currentChatUser = this.contacts.find(
        (data: any) => data._id == response.callerUser
      );
      this.isCaller = false;
      this.showCallScreen = true;

        this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
        this.rtcPeerConnection.onicecandidate = (event) =>
          this.onIceCandidateFunction(event);
        this.rtcPeerConnection.ontrack = (event) => this.onTrackFunction(event);
        this.rtcPeerConnection.addTrack(
          this.videoComponent.videoStream.getTracks()[0],
          this.videoComponent.videoStream
        ); //audio
        this.rtcPeerConnection.addTrack(
          this.videoComponent.videoStream.getTracks()[1],
          this.videoComponent.videoStream
        ); // video

        this.rtcPeerConnection.createOffer(
          (offer) => {
            console.log(offer, 'offer');
            this.rtcPeerConnection.setLocalDescription(offer);

            this.socketService.emit('offer', {
              offer,
              roomName: this.currentChatUser._id,
            });
          },
          (error) => {
            console.log(error, 'error');
          }
        );
    });

    this.socketService.listen('candidate').subscribe((candidate: any) => {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.rtcPeerConnection.addIceCandidate(iceCandidate);
    });

    this.socketService.listen('offer').subscribe((offer: any) => {
        this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
        this.rtcPeerConnection.onicecandidate = (event) =>
          this.onIceCandidateFunction(event);
        this.rtcPeerConnection.ontrack = (event) => this.onTrackFunction(event);
        this.rtcPeerConnection.addTrack(
          this.videoComponent.videoStream.getTracks()[0],
          this.videoComponent.videoStream
        ); //audio
        this.rtcPeerConnection.addTrack(
          this.videoComponent.videoStream.getTracks()[1],
          this.videoComponent.videoStream
        ); // video
        this.rtcPeerConnection.setRemoteDescription(offer);

        this.rtcPeerConnection.createAnswer(
          (answer) => {
            console.log(answer, 'answer');
            this.rtcPeerConnection.setLocalDescription(answer);
            this.socketService.emit('answer', { answer, roomName: this.currentChatUser._id });
          },
          (error) => {
            console.log(error, 'error');
          }
        );
    });

    this.socketService.listen('answer').subscribe((answer: any) => {
      this.rtcPeerConnection.setRemoteDescription(answer);
    });

  }

  onIceCandidateFunction = (event: any) => {
    console.log(event, 'onIceCandidateFunction');
    if (event.candidate) {
      this.socketService.emit('candidate', {
        candidate: event.candidate,
        roomName: this.activeUser._id,
      });
    }
  };

  onTrackFunction = (event: any) => {
    console.log(event, 'onTrackFunction');
    // const peerVideoElemet: HTMLVideoElement = this.peerVideo.nativeElement;
    // peerVideoElemet.srcObject = event.streams[0];
    // peerVideoElemet.play();

    this.videoComponent.getPeerMedia(event.streams[0]);
  };
}
