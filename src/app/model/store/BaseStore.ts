import { Scheme } from '../scheme.model';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Category } from '../helpers.model';
import { User } from '../user.model';


abstract class BaseStore<T extends IBaseObject> {
    protected readonly identifier: String;

    protected readonly api_url = 'https://api.backand.com';
    protected readonly contributor = 1;

    protected items: T[];
    protected itemObservable: Observable<T>;
    public totalRows = -1;

    // protected filter = [];
    protected defaultFilter = [];
    // TODO: Add default Filter

    constructor(protected http: Http) { } // private router: Router

    public getItems(forceRefresh?: boolean, pageNumber?: number, pageSize?: number, customFilter?: any): Observable<any> {
        // if (!forceRefresh && this.items) {
        //     return Observable.of(this.items);
        // }
        // if (!forceRefresh && this.itemObservable) {
        //     return this.itemObservable;
        // }

        let filter = this.defaultFilter;
        if (customFilter) {
            filter = filter.concat(customFilter);
        }
        const params = new URLSearchParams();

        if (pageSize) {
            params.set('pageSize', pageSize.toString());
        }
        if (pageNumber) {
            params.set('pageNumber', pageNumber.toString());
        }
        if (filter.length > 0) {
            params.set('filter', JSON.stringify(filter));
        }
        this.itemObservable = this.http.get(this.api_url + '/1/objects/' + this.identifier, {
            headers: this.authHeader,
            search: params
        }).map(data => this.extractData(data))
        .catch(err => {
            console.error('BaseStore error', err);
            return Observable.throw(new Error('BaseStore Error'));
        });
        return this.itemObservable;
    }

    public getItem(id: number, forceRefresh?: boolean): Observable<T> {
        if (!forceRefresh && this.items != null) {
            const item = this.items.find(x => x.id === id);
            if (item != null) {
                return Observable.of(item);
            }
        }
        return this.http.get(this.api_url + '/1/objects/' + this.identifier + '/' + id, {
            headers: this.authHeader,
        })
            .map(x => x.json())
            .catch(err => {
                console.error('BaseStore error', err);
                return Observable.throw(new Error('BaseStore Error'));
            });
    }

    protected extractData(res: Response) {
        const body = res.json();
        console.log('BaseStore Data: ', body);
        this.totalRows = body.totalRows;
        const result = body.data;
        this.addToCache(result);
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

export class BaseObject {
    public id: number;
}

export interface IBaseObject {
    id?: number;
}


@Injectable()
export class SchemeFavoriteStore extends BaseStore<{ id: number }> {
    protected identifier = 'contributor_favoriteSchemes';
    // const defaultFilter = [
    //     { fieldName: 'status', operator: 'greaterThanOrEqualsTo', value: '4' },
    // ];
    constructor(protected http: Http) {
        super(http);
    }

    public getItems(forceRefresh?: boolean): Observable<any> {
        const filter = [
            { fieldName: 'contributor', operator: 'in', value: '' + this.contributor }
        ];
        return super.getItems(forceRefresh ? forceRefresh : false, null, null, filter)
        .finally(() => {
            this.defaultFilter = [];
        });
    }

    public getItem(id: number, forceRefresh?: boolean): Observable<{id: number}> {

        // const filter = [
        //     { fieldName: 'contributor', operator: 'in', value: '' + this.contributor }
        // ];
        return super.getItem(id, forceRefresh ? forceRefresh : false);
    }
}

@Injectable()
export class SchemeStore extends BaseStore<Scheme> {
    protected identifier = 'schemes';
    constructor(protected http: Http, private favoriteStore: SchemeFavoriteStore) {
        super(http);
    }

    public totalRows = -1;

    public getItems(forceRefresh?: boolean, pageNumber?: number, pageSize?: number, filter?: any): Observable<any> {
        return this.favoriteStore.getItems()
            .flatMap((favoriteSchemes: Scheme[]) => {
                this.defaultFilter = [];
                return super.getItems(forceRefresh, pageNumber, pageSize, filter)
            .map(schemes => {
                schemes.forEach(scheme => {
                    const favScheme = favoriteSchemes.find((favSchemeObject: any) => {
                        if (scheme.id === +favSchemeObject.scheme) {
                            return true;
                        }
                    });
                    if (favScheme !== undefined) {
                        scheme.isFavorite = true;
                    } else {
                        scheme.isFavorite = false;
                    }
                });
                return schemes;
            });
        });
    }
}

@Injectable()
export class CategoryStore extends BaseStore<Category> {
    protected identifier = 'scheme_categories';
    constructor(protected http: Http) {
        super(http);
    }
}

@Injectable()
export class PlaceStore extends BaseStore<Category> {
    protected identifier = 'scheme_places';
    constructor(protected http: Http) {
        super(http);
    }
}

@Injectable()
export class UserStore extends BaseStore<User> {
    protected identifier = 'user';
    constructor(protected http: Http) {
        super(http);
    }
    public getItem() {
        return Observable.of(
            {
                id: 11,
                contributor: 1,
                firstname: 'Max',
                lastname: 'Mustermann',
                email: 'string',
                association: 2,
                association_name: 'string'
            }
        );
    }

    public getItems() {
        return Observable.throw(Error('Not Allowed.'));
    }
}




