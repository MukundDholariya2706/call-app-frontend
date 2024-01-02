import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  async getAvatarImages(): Promise<SafeResourceUrl[]> {
    const data: SafeResourceUrl[] = [];
    for (let i = 0; i < 4; i++) {
      try {
        const api =
          'https://api.multiavatar.com/4645646/' +
          Math.round(Math.random() * 1000);

        // Make HTTP request using HttpClient
        const image = await this.http
          .get(api, { responseType: 'text' })
          .toPromise();

        // Sanitize and push the image URL to the data array
        const bufferData = 'data:image/svg+xml;base64,' + btoa(image as string);
        data.push(this.sanitizer.bypassSecurityTrustResourceUrl(bufferData));
      } catch (error) {
        console.error('Error fetching avatar image:', error);
      }
    }

    return data;
  }
}
