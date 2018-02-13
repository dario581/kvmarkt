import { Scheme } from '../scheme.model';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { DataError } from '../../service/data.error';
import { ErrorService } from '../../service/error.service';
import { Category } from '../helpers.model';
import { User } from '../user.model';


abstract class BaseStore<T extends IBaseObject> {
    protected readonly identifier: String;

    protected readonly api_url = 'http://kvmarkt-api.azurewebsites.net/api/';
    protected readonly contributor = 1; // TODO: change

    protected items: T[];
    protected itemObservable: Observable<T>;
    public totalRows = -1;

    // protected filter = [];
    protected defaultFilter = [];
    // TODO: Add default Filter

    constructor(protected http: Http, protected errorService: ErrorService) { } // private router: Router

    public getItems(forceRefresh?: boolean, pageNumber?: number, pageSize?: number, customFilter?: any): Observable<any> {
        // if (!forceRefresh && this.items) {
        //     return Observable.of(this.items);
        // }
        // if (!forceRefresh && this.itemObservable) {
        //     return this.itemObservable;
        // }

        // let filter = this.defaultFilter;
        // if (customFilter) {
        //     filter = filter.concat(customFilter);
        // }
        // const params = new URLSearchParams();

        // if (pageSize) {
        //     params.set('pageSize', pageSize.toString());
        // }
        // if (pageNumber) {
        //     params.set('pageNumber', pageNumber.toString());
        // }
        // if (filter.length > 0) {
        //     params.set('filter', JSON.stringify(filter));
        // }
        this.itemObservable = this.http.get(this.api_url + this.identifier, {
            headers: this.authHeader,
            // search: params
        })
            .map(data => this.extractData(data))
            .catch(err => this.handleError(err));
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
            .map(x => x.json())
            .catch(err => this.handleError(err));
    }

    protected handleError(error) {
        const dataError = new DataError(error.status, error.statusText);
        this.errorService.setError(error.status);
        return Observable.throw(DataError);
    }

    protected extractData(res: Response) {
        const body = res.json();
        console.log('BaseStore Data: ', body);
        // this.totalRows = body.totalRows;
        const result = body.result;
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
    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
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

    public getItem(id: number, forceRefresh?: boolean): Observable<{ id: number }> {

        // const filter = [
        //     { fieldName: 'contributor', operator: 'in', value: '' + this.contributor }
        // ];
        return super.getItem(id, forceRefresh ? forceRefresh : false);
    }
}

@Injectable()
export class SchemeStore extends BaseStore<Scheme> {
    protected identifier = 'scheme';
    constructor(protected http: Http, protected errorService: ErrorService, private favoriteStore: SchemeFavoriteStore) {
        super(http, errorService);
    }

    public totalRows = -1;

    // public getItems(forceRefresh?: boolean, pageNumber?: number, pageSize?: number, filter?: any): Observable<any> {
    //     return this.favoriteStore.getItems()
    //         .flatMap((favoriteSchemes: Scheme[]) => {
    //             return super.getItems(forceRefresh, pageNumber, pageSize, filter)
    //                 .map(schemes => {
    //                     schemes.forEach(scheme => {
    //                         const favScheme = favoriteSchemes.find((favSchemeObject: any) => {
    //                             return scheme.id === +favSchemeObject.scheme;
    //                         });
    //                         if (favScheme !== undefined) {
    //                             scheme.isFavorite = true;
    //                         } else {
    //                             scheme.isFavorite = false;
    //                         }
    //                     });
    //                     return schemes;
    //                 });
    //         });
    // }
}

@Injectable()
export class CategoryStore extends BaseStore<Category> {
    protected identifier = 'category';
    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
    }
}

@Injectable()
export class PlaceStore extends BaseStore<Category> {
    protected identifier = 'place';
    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
    }
}

@Injectable()
export class UserStore extends BaseStore<User> {
    protected identifier = 'contributor';
    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
    }
    public getItem() {
        return super.getItem(+localStorage.getItem('backand_user_id'));
    }

    public getItems() {
        return Observable.throw(Error('Not Allowed.'));
    }
}




