import { LocalstorageService } from './../../services/localstorage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Response } from 'src/app/interface/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private localstorageService: LocalstorageService
  ) {}

  async getAvatarImages(): Promise<SafeResourceUrl[]> {
    const data: SafeResourceUrl[] = [];
    for (let i = 0; i < 4; i++) {
      try {
        const api =
          'https://api.multiavatar.com/4564567/' +
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

  registerUser(payload: any): Observable<Response> {
    return this.http.post<Response>(
      environment.apiUrl + '/user/register',
      payload
    );
  }

  loginUser(payload: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/user/login', payload);
  }

  setProfileAvatar(payload: any) {
    console.log(payload, 'payload');
    return this.http.post(environment.apiUrl + '/user/setavatar', payload);
  }
  
  getAuthorizationToken() {
    return this.localstorageService.getLocalStore('auth_token');
  }

  checkLogin() {
    if (!!this.localstorageService.getLocalStore('auth_token')) {
      return true;
    }
    return false;
  }

  activeUserDetails() {
    return this.localstorageService.getLocalStore('user');
  }
}
