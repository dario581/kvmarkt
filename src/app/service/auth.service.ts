import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user.model';
import { DataError } from './data.error';
import { BackandService } from './backand.service';



@Injectable()
export class AuthService {
  requestedUrl: string;

  public isLoggedIn = false;
  private userObservable: Observable<boolean>;


  constructor(private http: Http, private backandService: BackandService) {
    this.getUser();
  }

  signIn(user: string, pass: string): Observable<any> {
    return this.backandService.signIn(user, pass);
    // const creds = `username=${user}` +
    //   `&password=${pass}` +
    //   `&appName=${localStorage.getItem('backand_app_name')}` +
    //   `&grant_type=password`;
    // const header = new Headers();
    // header.append('Content-Type', 'application/x-www-form-urlencoded');
    // return this.http.post(localStorage.getItem('backand_url') + '/token', creds, {
    //   headers: header
    // }).map( (data) => {
    //   this.extractBody(data);
    // })
    //   .catch(this.handleError);
  }

  logout() {
    localStorage.removeItem('backand_user_username');
    localStorage.removeItem('backand_user_firstname');
    localStorage.removeItem('backand_user_lastname');
    localStorage.removeItem('backand_username');
    localStorage.removeItem('backand_user_id');
    localStorage.removeItem('backand_token');
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    const backandErrorCode = error.json().error;
    console.log('backandErrorCode', backandErrorCode);
    return Observable.throw(new DataError(error.status, backandErrorCode));
  }

  private extractBody(res: Response) {
    console.log(res.json());
    return res.json() || {};
  }

  public getUser(): Observable<boolean> {

    if (this.userObservable) {
      return this.userObservable;
    }

    if (!localStorage.getItem('backand_token') || !localStorage.getItem('backand_username')) {
      return Observable.throw(new Error('Auth Service getUser no item set'));
    }

    const header = new Headers();
    header.append('Authorization', 'Bearer ' + localStorage.getItem('backand_token'));

    const params = new URLSearchParams();
    params.set('parameters', '{username: "' + localStorage.getItem('backand_username') + '"}');

    this.userObservable = this.http.get(localStorage.getItem('backand_url') + '/1/query/data/userdetail', {
      headers: header,
      search: params
    })
    .map((data) => {
      const users = this.extractBody(data);
      console.log('Auth Data: ', users);
      this.isLoggedIn = true;
      return true;
    })
    .catch( (error) => {
      return Observable.throw(new Error('Auth Service getUser catch'));
    });

    return this.userObservable;
  }

}
