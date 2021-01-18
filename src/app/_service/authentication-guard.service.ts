import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate{
  private routeURL: string;
  constructor(private authService: AuthenticationService, private router: Router) {
    this.routeURL = this.router.url;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // here we check if user is logged in or not
    // the authService returs user object, or
    // it returns undefined/null when user is not logged in

    // SINCE OUR 'authService.user' IS OF TYPE 'Observable'
    // WE MUST USE 'subscribe' TO GET VALUE OF 'user'
    return new Promise((resolve, reject) => {
        if (!this.authService.isAuthenticated && this.routeURL !== '/login') {
          this.routeURL = '/login';
          this.router.navigate(['/login'], {
            queryParams: {
              return: 'login'
            }
          });
          return resolve(false);
        } else {
          this.routeURL = this.router.url;
          return resolve(true);
        }

    });
  }
}
