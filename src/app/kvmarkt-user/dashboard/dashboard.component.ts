import { Component, OnInit } from '@angular/core';
import { Blogpost } from '../../model/blogpost.model';
import { Scheme } from '../../model/scheme.model';
import { User } from '../../model/user.model';
import { SchemeStore, CategoryStore, PlaceStore, UserStore } from '../../model/store';

import 'rxjs/add/operator/distinct';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    blogpost: Blogpost;
    blogposts: Blogpost[];
    hint: string;
    errorMessage: string;

    user: User;

    favSchemes: Scheme[];
    ownSchemes: Scheme[] = null;

    loadingFavSchemes = true;
    loadingOwnSchemes = true;

    constructor(
        private _schemeStore: SchemeStore
        , private _categoryStore: CategoryStore
        , private _placeStore: PlaceStore
        , private _userStore: UserStore
    ) { }

    ngOnInit() {
        // this.getBlogposts();
        this._schemeStore
            .getItems()
            .distinct()
            .subscribe((schemes: Scheme[]) => {
                this.favSchemes = schemes
                    .filter((scheme) => {
                        return scheme.isFavorite;
                    })
                    .slice(0, 3);
                this.loadingFavSchemes = false;
            });

        this._userStore
            .getItem()
            .distinct()
            .subscribe((user: User) => {
                this.user = user;
                this._schemeStore.getItems(false)
                    .subscribe((schemes: Scheme[]) => {
                        this.ownSchemes = schemes
                            .filter((scheme: Scheme) => scheme.author === user.id)
                            .slice(0, 3);
                    });
                this.loadingOwnSchemes = false;
            });
        this.hint = 'Wird geladen...';
    }
}
