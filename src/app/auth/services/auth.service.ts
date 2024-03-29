import { User } from './../../interface/user';
import { SocketService } from 'src/app/services/socket.service';
import { LocalstorageService } from './../../services/localstorage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { Response } from 'src/app/interface/response';
import { Router } from '@angular/router';
import { RegisterUser } from 'src/app/interface/register-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
    private localstorageService: LocalstorageService,
    private socketService: SocketService
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

  registerUser(payload: RegisterUser): Observable<Response> {
    return this.http.post<Response>(
      environment.apiUrl + '/user/register',
      payload
    );
  }

  loginUser(payload: { email: string; password: string; }): Observable<Response> {
    return this.http.post<Response>(environment.apiUrl + '/user/login', payload);
  }

  setProfileAvatar(payload: { image: string }) {
    return this.http.post(environment.apiUrl + '/user/setavatar', payload).pipe(
      tap((res: any) => {
        if (res.status) {
          this.localstorageService.setLocalStore('user', res.data);
          this.router.navigate(['/']);
        }
      })
    );
  }

  logoutUser(payload: any = {}): Observable<Response> {
    return this.http.post(environment.apiUrl + '/user/logout', payload).pipe(
      tap((res: any) => {
        if (res.status) {
          this.socketService.putOfflineStatus();
          this.localstorageService.clearStorage();
          this.router.navigate(['/login']);
        }
      })
    );
  }

  getAuthorizationToken(): string {
    return this.localstorageService.getLocalStore('auth_token');
  }

  checkLogin(): boolean {
    if (!!this.localstorageService.getLocalStore('auth_token')) {
      return true;
    }
    return false;
  }

  activeUserDetails(): User {
    return this.localstorageService.getLocalStore('user');
  }
}
