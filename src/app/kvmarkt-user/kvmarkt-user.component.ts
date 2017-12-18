import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, NavigationStart } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { fadeAnimation } from '../animations';

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
  user_lastname: string;
  user_firstname: string;
  user_association: string;
  usergroup: string;

  pageTitle = '';
  _subscriptions: any[] = [];
  _routeScrollPositions: any[] = [];

  constructor(
    // private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appTitle: Title,
  ) { }

  ngOnInit() {
    this.user_firstname = localStorage.getItem('backand_user_firstname');
    this.user_lastname = localStorage.getItem('backand_user_lastname');
    this.user_association = localStorage.getItem('backand_user_association_name');
    this.setPageTitle();
    this.setWindowScrolling();
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
    // this.authService.logout();
    this.router.navigate(['/login']);
  }

  getState(outlet: any) {
    return outlet.activatedRouteData.title;
  }

}
