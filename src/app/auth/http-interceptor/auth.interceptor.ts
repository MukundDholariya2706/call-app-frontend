import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getAuthorizationToken();

    if (!!authToken && authToken !== undefined && authToken != null) {
      let authHeaderData = {
        Authorization: 'Bearer ' + authToken,
      };

      const authReq = request.clone({ setHeaders: { ...authHeaderData } });
      return next.handle(authReq);
    } else {
      return next.handle(request);
    }
  }
}
