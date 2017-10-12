import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (!localStorage.getItem('backand_token') || !localStorage.getItem('backand_username')) {
      const url: string = state.url;
      this.authService.requestedUrl = url;
      // this.router.navigate(['/login']);
      console.log('IsLoggedIn: ', this.authService.isLoggedIn);
      // return true;
    }

    if (this.authService.isLoggedIn) {
      return true;
    }

    return this.authService.getUser()
    .map( data => {
        if (data) {
          this.authService.isLoggedIn = true;
          return true;
        }
        this.router.navigate(['/login']);
        return false;
    })
    .catch( err => {
      this.router.navigate(['/login']);
      return Observable.of(false);
    });
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }


}
