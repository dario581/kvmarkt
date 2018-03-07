import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Scheme } from '../../../model/scheme.model';
import { SchemeStore, UserStore } from '../../../model/store';
import { User } from '../../../model/user.model';

@Component({
    selector: 'app-scheme-detail',
    templateUrl: './scheme-detail.component.html'
})
export class SchemeDetailComponent implements OnInit {

    scheme: Scheme;
    tagList: Array<{ name: string, id: number }> = [];
    user: User;

    userIsAuthor = false;

    constructor(private route: ActivatedRoute,
        private schemeStore: SchemeStore,
        private userStore: UserStore,
        private location: PlatformLocation
    ) {
        location.onPopState(() => {
            console.log('back');
            return false;
        });
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            const id = +params['id'];
            this.schemeStore.getItem(id)
                .flatMap( scheme => {
                    this.scheme = scheme;
                    return this.userStore.getItem();
                })
                .subscribe(user => {
                    this.user = user;
                    this.userIsAuthor = this.user.id === this.scheme.author;
                });
        });
    }

    public toggleSchemeLiked() {
        if (this.scheme.isFavorite) {
            this.schemeStore
                .removeFavorite(this.scheme.id)
                .subscribe((data) => this.scheme.isFavorite = data);
        } else {
            this.schemeStore
                .addFavorite(this.scheme.id)
                .subscribe((data) => this.scheme.isFavorite = data);
        }
    }

    printPage() {
        window.print();
    }

}
