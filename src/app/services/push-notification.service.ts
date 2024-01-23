import { Injectable } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { UserService } from '../modules/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private swUpdate: SwUpdate,
    private push: SwPush,
    private userService: UserService
  ) {}

  registerPushNotificationSubscription(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Notification is not enabled');
      return;
    }
    this.push
      .requestSubscription({ serverPublicKey: environment.webPushPublicKey })
      .then((pushSubscription: PushSubscription) => {
        console.log(pushSubscription, 'pushSubscription');
        this.userService.sendUserPushNotificationEndPoint(pushSubscription);
      })
      .catch((error: any) => {
        console.log('Could not subscribe to notifications', error);
      });
  }

  pushNotificationListen(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Notification is not enabled');
      return;
    }
    this.push.messages.subscribe((message: Object) => {
      console.log(message, 'pushNotificationListen');
    });
  }
}
