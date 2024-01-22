import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  constructor(private swUpdate: SwUpdate) {}

  chcekNewUpdateIsAvailable() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate
        .checkForUpdate()
        .then((res: any) => {
          console.log(res, 'update is available');
          if(res) window.location.reload();
        })
        .catch((err) => {})
        .catch((error: any) => {
          console.log(error, 'error');
        });
    } else {
      console.log('swUpdate is disabled');
    }
  }
}
