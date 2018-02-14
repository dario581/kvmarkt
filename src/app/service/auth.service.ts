import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user.model';
import { DataError } from './data.error';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { ISubscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/takeWhile';
import { UserStore } from '../model/store';

@Injectable()
export class AuthService implements OnInit {
    requestedUrl: string;
    screenMessage: string;
    private user: User;

    private isLoggedIn = true;
    private userObservable: Observable<boolean>;

    constructor(
        private http: Http,
        private userStore: UserStore,
        private errorService: ErrorService,
        private router: Router
    ) {
        this.reactOnError();
    }

    ngOnInit() {

    }

    hasCredentialsSet() {
        this.isLoggedIn = !!(localStorage.getItem('backand_token') && localStorage.getItem('backand_user_id'));
        return this.isLoggedIn;
    }

    signIn(user: string, pass: string): Observable<any> {
        return this.userStore.signIn(user, pass)
            .do(() => this.reactOnError)
            .do(() => this.screenMessage = null);
    }

    logout(message?: string) {
        localStorage.removeItem('backand_user_id');
        localStorage.removeItem('backand_token');
        this.isLoggedIn = false;
        this.screenMessage = 'Du wurdest abgemeldet.';
        if (message) {
            this.screenMessage = this.screenMessage + ' ' + message;
        }
        this.router.navigate(['/login']);
    }


    reactOnError() {
        console.log('Error reaction handler registered.');
        this.errorService.getError()
            .takeWhile(() => this.isLoggedIn)
            .filter((error: DataError) => {
                return error.httpCode === 401;
            })
            .subscribe((error: DataError) => {
                console.error('[AuthService] Catched 401 Error', error);
                // this.requestedUrl = this.route TODO
                this.logout('Anmedlung abgelaufen.');
            });
    }

}
