import { ActivatedRoute, Router } from '@angular/router';
// import { filter, first } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Scheme } from '../../model/scheme.model';
import { slideTileAnimation } from '../../animations';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { SchemeStore, CategoryStore, PlaceStore, UserStore } from '../../model/store';

import 'rxjs/add/operator/first';
import { Category, Place } from '../../model/helpers.model';

@Component({
    selector: 'app-schemes',
    templateUrl: './schemes.component.html',
    styleUrls: ['./schemes.component.css'],
    animations: [slideTileAnimation]
})
export class SchemesComponent implements OnInit, OnDestroy {
    private active = true;
    schemes: Scheme[] = [];

    typePagination = false;

    page = 1;
    pageSize = 4;
    totalRows: number;
    countPages: Array<any> = new Array<any>();

    onlyFavorites = false;
    onlyOwn = false;

    categoriesID: number[];
    categories: any[];

    private readonly defaultSortingField = 'title';
    private readonly defaultSortingOrderAsc = true;
    private readonly defaultSortingString = 'alpha_asc';

    selectedSortingField = this.defaultSortingField;
    selectedSortingOrderAsc = this.defaultSortingOrderAsc;
    selectedSortingString = this.defaultSortingString;

    loading = false;
    firstLoad = true;
    private schouldAnimateSchemes = 'yes';

    scheme_categories: Category[] = [];
    scheme_places: Place[] = [];
    scheme_ages: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    age_start = this.scheme_ages[0];
    age_end = this.scheme_ages[this.scheme_ages.length - 1];
    scheme_category = 0;
    scheme_place = 0;
    author: number;

    constructor
        (private schemeStore: SchemeStore
        , private categoryStore: CategoryStore
        , private placeStore: PlaceStore
        , private route: ActivatedRoute
        , private router: Router
        , private userStore: UserStore
        ) { }

    ngOnInit() {
        this.route.params
            .takeWhile(() => this.active)
            .subscribe(params => {
                this.schemes = [];
                // set page
                this.page = +params['page'] || this.page;
                // TODO: Check for parameter changes and reset schemes if needed
                this.scheme_place = +params['place'] || this.scheme_place;
                this.scheme_category = +params['categories'] || this.scheme_category;
                this.age_start = +params['age_start'] || this.age_start;
                this.age_end = +params['age_end'] || this.age_end;
                this.onlyFavorites = (+params['favorites'] === 1) || false;
                this.onlyOwn = (+params['own'] === 1) || false;
                // this.setCategories(params['categories'] || '');
                this.setSorting(params['sort'] || '');
                if (this.firstLoad) {
                    for (let i = 1; i < this.page; i++) {
                        this.loadSchemes(i, this.pageSize);
                    }
                }
                this.loadSchemes(this.page, this.pageSize);
                this.firstLoad = false;
                // }
            });
        this.categoryStore.getItems()
            .first()
            .subscribe(
                data => this.scheme_categories = this.scheme_categories.concat(data),
                (err) => this.scheme_categories = [{ name: 'Fehler beim laden', id: 1 }]
            );
        this.placeStore.getItems()
            .first()
            .subscribe(
                data => this.scheme_places = this.scheme_places.concat(data),
                (err) => this.scheme_places = [{ name: 'Fehler beim laden', id: 1 }]
            );
    }

    ngOnDestroy() {
        this.active = false;
    }

    private setSorting(sortingString: string) {
        if (sortingString === '') { return; }
        switch (sortingString) {
            case 'date_desc':
                this.selectedSortingString = 'date_desc';
                this.selectedSortingField = 'created';
                this.selectedSortingOrderAsc = false;
                break;
            case 'date_asc':
                this.selectedSortingString = 'date_asc';
                this.selectedSortingField = 'created';
                this.selectedSortingOrderAsc = true;
                break;
            case 'alpha_desc':
                this.selectedSortingString = 'alpha_desc';
                this.selectedSortingField = 'title';
                this.selectedSortingOrderAsc = false;
                break;
            case 'alpha_asc':
                this.selectedSortingString = 'alpha_asc';
                this.selectedSortingField = 'title';
                this.selectedSortingOrderAsc = true;
                break;
            default:
                this.selectedSortingString = this.defaultSortingString;
                this.selectedSortingField = this.defaultSortingField;
                this.selectedSortingOrderAsc = this.defaultSortingOrderAsc;
                break;
        }
    }

    onParameterChange() {
        this.setSorting(this.selectedSortingString);
        // this.schemes = [];
        this.page = 1;
        // this.loadSchemes(this.page, this.pageSize);
        this.setRouteUrl();
    }

    appendSchemes() {
        this.page++;
        this.loadSchemes(this.page, this.pageSize);
        // this.setRouteUrl();
    }

    private setRouteUrl() {
        // set params
        // page
        const params: any = {};
        // params.page = this.page;

        if (this.scheme_category !== 0) {
            params.categories = this.scheme_category;
        }

        // place
        if (this.scheme_place !== 0) {
            params.place = this.scheme_place;
        }
        // age
        if (this.age_start > this.scheme_ages[0]) {
            params.age_start = this.age_start;
        }
        if (this.age_end < this.scheme_ages[this.scheme_ages.length - 1]) {
            params.age_end = this.age_end;
        }

        // favorites and own
        if (this.onlyFavorites) {
            params.favorites = 1;
        }
        if (this.onlyOwn) {
            params.own = 1;
        }

        // sorting
        if (this.selectedSortingString !== this.defaultSortingString) {
            params.sort = this.selectedSortingString;
        }
        // change route; alternative change Location
        this.router.navigate(['/schemes', params]);
    }

    loadSchemes(page: number, pageSize: number) {
        this.loading = true;
        this.schouldAnimateSchemes = 'no';
        setTimeout(() => this.loadSchemesFromStore(page, pageSize), 1);
    }

    // private loadSchemesFromStore(page: number, pageSize: number) {
    //   const schemeFilter = [
    //     { fieldName: 'age_start', operator: 'lessThanOrEqualsTo', value: '' + this.age_end },
    //     { fieldName: 'age_end', operator: 'greaterThanOrEqualsTo', value: '' + this.age_start }
    //   ];
    //   if (this.scheme_category > 0) {
    //     schemeFilter.push(
    //       { fieldName: 'category', operator: 'in', value: '' + this.scheme_category }
    //     );
    //   }
    //   if (this.scheme_place > 0) {
    //     schemeFilter.push(
    //       { fieldName: 'place', operator: 'in', value: '' + this.scheme_place }
    //     );
    //   }
    //   // TODO: Add Sorting
    //   // this.schemeStore.setFilter(schemeFilter);
    //   this.schemeStore
    //     .getItems(true, page, pageSize, schemeFilter)
    //     .first()
    //     .subscribe(
    //     data => this.handleSchemes(data),
    //     err => this.loading = false
    //     );
    // }

    private loadSchemesFromStore(page: number, pageSize: number) {
        this.userStore.getItem()
            .do( (user) => this.author = user.id)
            .flatMap( (data) => this.schemeStore.getItems() )
            .subscribe((schemes) => {
                const result = schemes.filter((scheme) => {
                    if (this.checkSchemeParameters(scheme)) {
                        return true;
                    }
                });
                this.totalRows = result.length;
                // this.countPages = new Array(Math.ceil(this.totalRows / this.pageSize));
                this.loading = false;
                this.schemes = result;
                this.schouldAnimateSchemes = 'yes';
            });
    }

    checkSchemeParameters(scheme: Scheme): boolean {
        let schemeFilter = scheme.ageEnd >= this.age_start && scheme.ageStart <= this.age_end;
        if (this.scheme_category !== 0) {
            schemeFilter = schemeFilter && +scheme.category === this.scheme_category;
        }
        if (this.scheme_place !== 0) {
            schemeFilter = schemeFilter && +scheme.place === this.scheme_place;
        }
        if (this.age_start > this.scheme_ages[0]) {
            schemeFilter = schemeFilter && +scheme.ageEnd >= this.age_start;
        }
        if (this.age_end <= this.scheme_ages[this.scheme_ages.length - 1]) {
            schemeFilter = schemeFilter && +scheme.ageStart <= this.age_end;
        }
        if (this.onlyFavorites) {
            schemeFilter = schemeFilter && scheme.isFavorite;
        }
        if (this.onlyOwn) {
            schemeFilter = schemeFilter && scheme.author === this.author;
        }
        return schemeFilter;
    }

    // handleSchemes(schemes: Scheme[]) {
    //     if (this.schemes === undefined) {
    //         this.schemes = [];
    //     }
    //     schemes.forEach(
    //         (scheme: Scheme) => {
    //             this.schemes.push(scheme);
    //         }
    //     );
    //     // this.schemes = schemes;
    //     this.totalRows = this.schemeStore.totalRows;
    //     // this.countPages = new Array(Math.ceil(this.totalRows / this.pageSize));
    //     this.loading = false;
    //     this.schouldAnimateSchemes = 'yes';
    // }

    getSchemeAnimateState() {
        return this.schouldAnimateSchemes; // + this.schemes.length;
    }
}
