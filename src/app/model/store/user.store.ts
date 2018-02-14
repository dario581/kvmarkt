import { User } from '../user.model';
import { BaseStore } from './base.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorService } from '../../service/error.service';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/share';

@Injectable()
export class UserStore extends BaseStore<User> {

    protected identifier = 'contributor';
    // private user: User;

    private userSignInObservable: Observable<any>;

    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
    }
    public getItem() {
        if (this.items) {
            return Observable.of(this.items[0]);
        }
        if (this.itemObservable) {
            return this.itemObservable;
        }
        if (this.userSignInObservable) {
            return this.userSignInObservable.flatMap((res) => {
                return this.fetchUser(this.items[0].id);
            });
        }
        this.itemObservable = this.fetchUser(+localStorage.getItem('backand_user_id'));
        return this.itemObservable;
    }

    private fetchUser(userId: number): Observable<any> {
        return this.http.get(this.api_url + this.identifier + '/' + userId, {
            headers: this.authHeader,
        })
            .map(data => this.extractData(data))
            .do((item: User) => this.items = [item])
            .catch(err => this.handleError(err))
            .share();
    }

    public getItems() {
        return Observable.throw(Error('Not Allowed. (Custom Error; May be Allowed in future.)'));
    }

    public signIn(user: string, pass: string) {
        const creds = {
            'Email': user,
            'Password': pass
        };
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        this.userSignInObservable = this.http.post(this.api_url + 'account/login', creds, {
            headers: header
        })
            .map(res => {
                const data = res.json().result;
                localStorage.setItem('backand_token', data.token); // TODO: Use functions of BaseStore
                localStorage.setItem('backand_user_id', data.id);
                const userInfo = {
                    id: data.id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    contributor: data.id,
                    email: data.email,
                    association: data.association.id,
                    associationName: data.association.name
                };
                this.items = [userInfo];
                return userInfo;
            })
            .catch(err => this.handleError(err));
        return this.userSignInObservable;
    }
}
