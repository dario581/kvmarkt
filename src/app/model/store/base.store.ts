import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { DataError } from '../../service/data.error';
import { ErrorService } from '../../service/error.service';
import { Category, Place } from '../helpers.model';
import { User } from '../user.model';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concat';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';


export abstract class BaseStore<T extends IBaseObject> {
    protected readonly identifier: String;

    protected readonly api_url = 'http://kvmarkt-api.azurewebsites.net/api/';
    // protected readonly api_url = 'http://localhost:5000/api/';

    protected items: T[];
    protected itemObservable: Observable<T[]>;
    public totalRows = -1;

    // protected filter = [];
    protected defaultFilter = [];
    // TODO: Add default Filter

    constructor(protected http: Http, protected errorService: ErrorService) { } // private router: Router

    public getItems(forceRefresh?: boolean, pageNumber?: number, pageSize?: number, customFilter?: any): Observable<T[]> {
        if (this.items && !forceRefresh) {
            return Observable.of(this.items);
        }
        if (this.itemObservable) {
            return this.itemObservable;
        }
        this.itemObservable = this.http.get(this.api_url + this.identifier, {
            headers: this.authHeader,
            // search: params
        })
            // .debounceTime(500)
            .map(data => this.extractData(data))
            .do((data: any[]) => {
                this.totalRows = data.length;
                this.items = data;
                // this.itemObservable = null;
            })
            .catch(err => this.handleError(err))
            .share();
        return this.itemObservable;
    }

    public getItem(id: number, forceRefresh?: boolean): Observable<T> {
        if (!forceRefresh && this.items != null) {
            const item = this.items.find(x => x.id === id);
            if (item != null) {
                return Observable.of(item);
            }
        }
        return this.http.get(this.api_url + this.identifier + '/' + id, {
            headers: this.authHeader,
        })
            .map(data => this.extractData(data))
            .catch(err => this.handleError(err))
            .share();
    }

    protected handleError(error) {
        const dataError = new DataError(error.status, error.message);
        this.errorService.setError(error.status);
        console.error(`BaseStore; ${this.identifier}`, error);
        return Observable.throw(error);
    }

    protected extractData(res: Response) {
        const body = res.json();
        console.log('BaseStore Data; ' + this.identifier + ': ', body);
        // this.totalRows = body.totalRows;
        const result = body.result;
        return result || {};
    }

    protected addToCache(list: T[]) {
        if (this.items == null) {
            this.items = list;
            return;
        }
        list.forEach(item => {
            const index = this.items.findIndex(x => x.id === item.id);
            if (index === -1) {
                this.items.push(item);
            }
            this.items[index] = item;
        });
    }

    protected get authHeader() {
        const authHeader = new Headers();
        if (localStorage.getItem('backand_token')) {
            const jwt = localStorage.getItem('backand_token');
            authHeader.append('Authorization', 'Bearer ' + jwt);
        }
        return authHeader;
    }

    // public setFilter(filter) {
    //     this.filter = filter;
    // }
}

export abstract class BaseCreateStore<T extends IBaseObject> extends BaseStore<T> {

    protected addObservable: Observable<any>;

    public addItem(item: T) {
        // const body = {
        //     'Email': user,
        //     'Password': pass
        // };
        this.addObservable = this
            .http
            .post(this.api_url + this.identifier, item, {
                headers: this.authHeader,
            })
            .map(data => this.extractData(data))
            .do( (data) => {
                if (!this.items) {
                    this.items = [];
                }
                this.items.push(data);
                // if (this.items) {
                //     const changedIndex = this.items.findIndex( i => {
                //         if (i.id === data.id) {
                //             return true;
                //         }
                //     });
                //     this.items[changedIndex] = data;
                // }
            })
            .catch(err => this.handleError(err));
        return this.addObservable;
    }

    updateItem(item: T) {
        return this.http
            .patch(this.api_url + this.identifier, item, {
                headers: this.authHeader,
            })
            .map(data => this.extractData(data))
            .do((data) => {
                const index = this.items.findIndex(x => x.id === item.id);
                this.items[index] = data;
            })
            .catch(err => this.handleError(err));
    }

}

export abstract class BaseCreateAndFavoriteStore<T extends IBaseFavoriteObject> extends BaseCreateStore<T> {

    favoriteObservalbe: Observable<boolean>;

    public addFavorite(id: number) {
        return this.favorite(id, true);
    }

    private favorite(id: number, add: boolean) {
        const action = add ? 'add' : 'remove';
        this.favoriteObservalbe = this.http.get(this.api_url + this.identifier + '/' + id + '/favorites/' + action,
            { headers: this.authHeader })
            .debounceTime(500)
            .map(data => this.extractData(data))
            .map(data => data.isFavorite)
            .do((data) => {
                if (this.items) {
                    const changedIndex = this.items.findIndex((item) => {
                        if (item.id === id) {
                            return true;
                        }
                    });
                    this.items[changedIndex].isFavorite = data;
                }
            })
            .catch(err => this.handleError(err));
        return this.favoriteObservalbe;
    }

    public removeFavorite(id: number) {
        return this.favorite(id, false);
    }

}

export interface IBaseObject {
    id?: number;
}

export interface IBaseFavoriteObject extends IBaseObject {
    isFavorite?: boolean;
}




@Injectable()
export class CategoryStore extends BaseStore<Category> {
    protected identifier = 'category';
    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
    }
}

@Injectable()
export class PlaceStore extends BaseStore<Place> {
    protected identifier = 'place';
    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
    }
}





