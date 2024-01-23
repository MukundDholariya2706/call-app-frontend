import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  constructor(private swUpdate: SwUpdate) {}

  chcekNewUpdateIsAvailable(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate
        .checkForUpdate()
        .then((res: boolean) => {
          console.log(res, 'update is available');
          if(res) window.location.reload();
        })
        .catch((error) => {
          console.log(error, 'error');
        });
    } else {
      console.log('swUpdate is disabled');
    }
  }
}
