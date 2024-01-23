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
    // Condition 1: If checkLogin is undefined, go to the login page
    const isUserLoggedIn = this.authService.checkLogin();
    if (!isUserLoggedIn) {
      return this.router.createUrlTree(['..', 'login']);
    }

    // Condition 2: If checkLogin is true, check user data
    if (isUserLoggedIn) {
      const user = this.authService.activeUserDetails();

      // Subcondition a: If user isAvatarImageSet is false, redirect to set-avatar page (if not already on /set-avatar)
      if (user && !user.isAvatarImageSet && state.url !== '/set-avatar') {
        return this.router.createUrlTree(['/set-avatar']);
      }

      // Subcondition b: If user isAvatarImageSet is true, redirect to home page (if on set-avatar page)
      if (user && user.isAvatarImageSet && state.url === '/set-avatar') {
        return this.router.createUrlTree(['/']);
      }

      // Default: User is logged in, but no specific condition matched, continue with the route
      return true;
    }

    // Default: User is not logged in, redirect to login page
    return this.router.createUrlTree(['..', 'login']);
  }
}
