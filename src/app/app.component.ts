import { PushNotificationService } from './services/push-notification.service';
import { Component, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';
import { environment } from 'src/environments/environment';
import { VersionService } from './services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'call-app-frontend';

  constructor(
    private socketService: SocketService,
    private versionService: VersionService,
    private pushNotificationService: PushNotificationService
  ) {
    console.log(environment.apiUrl, 'apiUrl');

    // start socket connection
    this.socketService.startSocket();

    // check any new update is available 
    this.versionService.chcekNewUpdateIsAvailable();

    // check any web push notification is available
    this.pushNotificationService.pushNotificationListen();
  }

  ngOnInit(): void {
    console.log(environment.name, 'environment');
  }
}
