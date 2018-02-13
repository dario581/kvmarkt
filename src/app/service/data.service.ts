import { Observable } from 'rxjs/Rx';
import { Scheme } from '../model/scheme.model';
import { Error } from 'tslint/lib/error';
import { User } from '../model/user.model';
import { Team } from '../model/team.model';
import { Injectable } from '@angular/core';
import { DataServiceModel } from '../model/data-service.model';
import { BackandService } from './backand.service';
import { AuthService } from './auth.service';
import { CategoryStore, PlaceStore } from '../model/store/BaseStore';

@Injectable()
export class DataService implements DataServiceModel {

  private _schemes: Scheme[];
  private _schemesObservable: Observable<Scheme[]>;

  private _teams: Team[];
  private _teamsObservable: Observable<Team[]>;

  private _teamsOfContributor: Team[];
  private _teamsOfContributorObservable: Observable<Team[]>;

  constructor(
    private _backandService: BackandService,
    private _authService: AuthService,
    private categoryStore: CategoryStore,
    private placeStore: PlaceStore,
  ) { }


  getSchemes(): Observable<Scheme[]> {
      return Observable.of(this._schemes);
  }

  getScheme(id: number): Observable<Scheme> {
    return this.getSchemes().map((schemes: Scheme[]) => {
      return schemes.find((scheme) => {
        return scheme.id === id;
      });
    });
  }


  getUser(): Observable<User> {
    const userObservable = this._backandService.getUser()
      .map((user) => {
        // this._user = user;
        return user;
      });
    return userObservable;
  }

  getTeams() {

      return Observable.of(this._teams);

  }


  getTeamsOfContributor(contributor?: number): Observable<Team[]> {
    if (contributor) {
      return this._getTeamsOfContributor(contributor);
    }
    return this.getUser()
      .flatMap((user: User) => {
        return this._getTeamsOfContributor(user.contributor);
      });
  }

  private _getTeamsOfContributor(contributor: number): Observable<Team[]> {
    return this._teamsOfContributorObservable;
  }

  addSchemeToFavorites(schemeId: number) {
    return Observable.of(null);
  }

  removeSchemeFromFavorites(schemeId: number) {
    return Observable.of(null);
  }

  getCategories(): Observable<{ id: number; name: string; }[]> {
    return this.categoryStore.getItems();
  }
  getPlaces(): Observable<{ id: number; name: string; }[]> {
    return this.placeStore.getItems();
  }
  getTeam(): Observable<Team[]> {
    throw new Error('Method not implemented.');
  }



  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error('Backand Error message: ' + errMsg); // log to console instead
    // console.log('Error content: ' + error.body);
    return Observable.of(null);
  }

}
