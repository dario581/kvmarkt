import { Scheme } from '../scheme.model';
import { BaseStore, BaseCreateAndFavoriteStore } from './base.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorService } from '../../service/error.service';
import { Http } from '@angular/http';

@Injectable()
export class SchemeStore extends BaseCreateAndFavoriteStore<Scheme> {

    protected identifier = 'scheme';
    public totalRows = -1;

    constructor(protected http: Http, protected errorService: ErrorService) {
        super(http, errorService);
    }


    public getItem(id: number, refresh?: boolean) {
        return super.getItem(id, refresh).concat(this.getItems()
            .map(
                (data: Scheme[]) => data.find(s => s.id === id)
            )
        );
    }
}
