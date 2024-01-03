import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('AuthGuard triggered for route:', state.url);
    if (this.authService.checkLogin()) {
      const user = this.authService.activeUserDetails();

      if (user && user?.isAvatarImageSet) {
        return true;
      } else if (state.url !== '/set-avatar') {
        return this.router.navigate(['/set-avatar']);
        // return this.router.createUrlTree(['/set-avatar']);
      }

      return true;
    }
    return this.router.navigate(['..', 'login']);
    // return this.router.createUrlTree(['..', 'login']);
  }
}
