import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user.model';
import { DataError } from './data.error';
import { BackandService } from './backand.service';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { ISubscription } from 'rxjs/Subscription';



@Injectable()
export class AuthService implements OnInit {
  requestedUrl: string;
  user: User;


  private isLoggedIn = true;
  private userObservable: Observable<boolean>;


  constructor(
    private http: Http,
    private backandService: BackandService,
    private errorService: ErrorService,
    private router: Router
  ) {
    this.reactOnError();
  }

  ngOnInit() {

  }

  hasCredentialsSet() {
    this.isLoggedIn = !(!localStorage.getItem('backand_token') || !localStorage.getItem('backand_username'));
    return this.isLoggedIn;
  }

  signIn(user: string, pass: string): Observable<any> {
    return this.backandService.signIn(user, pass)
      .do(() => this.reactOnError);
  }

  logout() {
    localStorage.removeItem('backand_user_username');
    localStorage.removeItem('backand_user_firstname');
    localStorage.removeItem('backand_user_lastname');
    localStorage.removeItem('backand_username');
    localStorage.removeItem('backand_user_id');
    localStorage.removeItem('backand_token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  setUserInfo() {
    return this.backandService.getUser()
    .flatMap( (userData: User) => {
      localStorage.setItem('backand_user_firstname', userData.firstname);
      localStorage.setItem('backand_user_lastname', userData.lastname);
      localStorage.setItem('backand_user_association', '' + userData.association);
      localStorage.setItem('backand_user_association_name', userData.association_name);
      localStorage.setItem('backand_user_id', '' + userData.id);
      return Observable.of(true);
    });
  }

  reactOnError() {
    console.log('error reaction handler registered');
    this.errorService.getError()
    .takeWhile(() => this.isLoggedIn)
    .filter( (error: DataError) => {
      return error.httpCode === 401;
    })
    .subscribe( (error: DataError) => {
      console.error('[AuthService] Catched 401 Error', error);
      // this.requestedUrl = this.route TODO
      this.logout();
    });
  }

}
