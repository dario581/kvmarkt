import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/throw';
import { Blogpost } from '../model/blogpost.model';
import { Scheme } from '../model/scheme.model';
import { Team } from '../model/team.model';
import { User } from '../model/user.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { DataError } from './data.error';
import { ErrorService } from './error.service';
import { UserStore } from '../model/store/BaseStore';

@Injectable()
export class BackandService {

  auth_token: { header_name: string, header_value: string } = { header_name: '', header_value: '' };
  api_url = 'https://api.backand.com';
  app_name = 'cvjs';
  auth_type = 'N/A';
  auth_status = '';
  is_auth_error = false;


  private user: User;
  private userObservable: Observable<User>;

  constructor(
    private http: Http,
    private router: Router,
    private errorService: ErrorService,
    private userStore: UserStore
  ) { }


  /* other */
  get tokenUrl() {
    return this.api_url + '/token';
  }

  // private user: User;

  public signIn(user: string, pass: string) {
    this.auth_type = 'Token';
    // let http = Http;
    // const creds = `Email=${user}` +
    //   `&Password=${pass}`;
    const creds = {
      'Email': user,
      'Password': pass
    };
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:5000/api/account/login', creds, {
      headers: header
    })
      .map(res => {
        this._setToken(res);
        const data = res.json().result;
        this.user = {
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          contributor: data.id,
          email: data.email,
          association: data.association.id,
          association_name: data.association.name
        };
        return this.extractBody(res);
      })
      .catch(err => this.handleError(err));
  }

  private _setTokenHeader(jwt: any) {
    if (jwt) {
      this.auth_token.header_name = 'Authorization';
      this.auth_token.header_value = 'Bearer ' + jwt;
    }
  }

  private _setToken(res: any) {
    const jwt = res.json().result.token;
    localStorage.setItem('backand_token', jwt);
    this._setTokenHeader(jwt);
    return jwt;
  }

  private get authHeader() {
    const authHeader = new Headers();
    if (localStorage.getItem('backand_token')) {
      this._setTokenHeader(localStorage.getItem('backand_token'));
      authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
    }
    return authHeader;
  }

  private extractData(res: Response) {
    const body = res.json();
    console.log(body);
    const result = body.data;
    return result || {};
  }

  private extractBody(res: Response) {
    console.log(res.json());
    return res.json().result || {};
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this.errorService.setError(error.status);
    return Observable.throw(errMsg);
  }

  public getUser(b?: any) {
    if (this.user) {
      return Observable.of(this.user);
    }
    return this.userStore.getItem();
  }

}
