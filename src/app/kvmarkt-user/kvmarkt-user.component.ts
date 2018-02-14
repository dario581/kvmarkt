import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/pairwise';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, NavigationStart } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { fadeAnimation } from '../animations';
import { User } from '../model/user.model';
import { AuthService } from '../service/auth.service';
import { UserStore } from '../model/store';
import { ErrorService } from '../service/error.service';

@Component({
    selector: 'app-kvmarkt-user',
    templateUrl: './kvmarkt-user.component.html',
    styleUrls: ['./kvmarkt-user.component.css'],
    animations: [fadeAnimation]
})
export class KvmarktUserComponent implements OnInit, OnDestroy {

    menuIsOpen = false;
    profileMenuIsActive = false;
    notificationCenterIsActive = false;
    showNotification = false;
    activeNotification: { title: string, message: string };
    usergroup: string;

    pageTitle = '';
    _subscriptions: any[] = [];
    _routeScrollPositions: any[] = [];

    user: User;

    constructor(
        // private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appTitle: Title,
        private userStore: UserStore,
        private authService: AuthService,
        private errorService: ErrorService
    ) { }

    ngOnInit() {
        this.userStore.getItem()
            .subscribe(user => this.user = user);
        this.setPageTitle();
        this.connectToErrorService();
        // this.setWindowScrolling();
    }

    connectToErrorService() {
        this.errorService
            .getError()
            .subscribe((error) => {
                this.activeNotification = {
                    title: '' + error.httpCode,
                    message: error.message
                };
                this.showNotification = true;
                setTimeout(() => this.showNotification = false, 5000);
            });
    }

    ngOnDestroy() {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    setWindowScrolling() {
        this._subscriptions.push(
            // save or restore scroll position on route change
            this.router.events.pairwise().subscribe(([prevRouteEvent, currRouteEvent]) => {
                if (prevRouteEvent instanceof NavigationEnd && currRouteEvent instanceof NavigationStart) {
                    this._routeScrollPositions[prevRouteEvent.url] = window.pageYOffset;
                }
                if (currRouteEvent instanceof NavigationEnd) {
                    window.scrollTo(0, this._routeScrollPositions[currRouteEvent.url] || 0);
                }
            })
        );
    }

    setPageTitle() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route): any => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            })
            .mergeMap(route => route.data)
            .subscribe((event) => {
                if ('title' in event) {
                    this.pageTitle = event['title'];
                    this.appTitle.setTitle(this.pageTitle + ' - KV Markt');
                } else {
                    this.pageTitle = '';
                    this.appTitle.setTitle('KV Markt');
                }
            });
    }

    toggleMenu(event: Event) {
        this.menuIsOpen ? this.menuIsOpen = false : this.menuIsOpen = true;
        event.preventDefault();
    }

    toggleProfileMenu(event: Event) {
        this.profileMenuIsActive ? this.profileMenuIsActive = false : this.profileMenuIsActive = true;
    }

    logout() {
        this.authService.logout();
        // this.router.navigate(['/login']);
    }

    getState(outlet: any) {
        return outlet.activatedRouteData.title;
    }

}
