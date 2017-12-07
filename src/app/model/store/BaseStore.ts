import { Scheme } from '../scheme.model';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';


abstract class BaseStore<T extends IBaseObject> {
    protected readonly identifier: String;

    protected readonly api_url = 'https://api.backand.com';
    protected readonly contributor = 1;

    protected items: T[];
    protected itemObservable: Observable<T>;
    public totalRows = -1;

    protected filter = [];
    protected defaultFilter = [];
    // TODO: Add default Filter

    constructor(protected http: Http) { } // private router: Router

    public getItems(forceRefresh?: boolean, pageNumber?: number, pageSize?: number): Observable<any> {
        if (!forceRefresh && this.items) {
            return Observable.of(this.items);
        }
        const filter = this.defaultFilter.concat(this.filter);
        const params = new URLSearchParams();

        if (pageSize) {
            params.set('pageSize', pageSize.toString());
        }
        if (pageNumber) {
            params.set('pageNumber', pageNumber.toString());
        }

        params.set('filter', JSON.stringify(filter));
        return this.http.get(this.api_url + '/1/objects/' + this.identifier, {
            headers: this.authHeader,
            search: params
        }).map(data => this.extractData(data))
        .catch(err => {
            console.error('BaseStore error', err);
            return Observable.throw(new Error('BaseStore Error'));
        });
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

    public setFilter(filter) {
        this.filter = filter;
    }
}

export class BaseObject {
    public id: number;
}

export interface IBaseObject {
    id: number;
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
        this.defaultFilter = [
            { fieldName: 'contributor', operator: 'in', value: '' + this.contributor }
        ];
        return super.getItems(forceRefresh ? forceRefresh : false);
    }

    public getItem(id: number, forceRefresh?: boolean): Observable<{id: number}> {

        this.filter = [
            { fieldName: 'contributor', operator: 'in', value: '' + this.contributor }
        ];
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

    public getItems(forceRefresh?: boolean, pageNumber?: number, pageSize?: number): Observable<any> {
        return this.favoriteStore.getItems()
            .flatMap((favoriteSchemes: Scheme[]) => {
                return super.getItems(forceRefresh, pageNumber, pageSize)
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




