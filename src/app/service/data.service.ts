import { Observable } from 'rxjs/Rx';
import { Scheme } from '../model/scheme.model';
import { Error } from 'tslint/lib/error';
import { User } from '../model/user.model';
import { Team } from '../model/team.model';
import { Injectable } from '@angular/core';
import { DataServiceModel } from '../model/data-service.model';
import { BackandService } from './backand.service';
import { AuthService } from './auth.service';

@Injectable()
export class DataService implements DataServiceModel {

  private _schemes: Scheme[];
  private _schemesObservable: Observable<Scheme[]>;

  private _teams: Team[];
  private _teamsObservable: Observable<Team[]>;

  private _teamsOfContributor: Team[];
  private _teamsOfContributorObservable: Observable<Team[]>;

  constructor(private _backandService: BackandService, private _authService: AuthService) { }


  getSchemes(): Observable<Scheme[]> {
    if (!this._authService.isLoggedIn) {
      return;
    }
    if (this._schemes) {
      return Observable.of(this._schemes);
    }
    if (this._schemesObservable) {
      return this._schemesObservable;
    }
    this._schemesObservable = this._backandService.getUser()
      .catch(this.handleError)
      .flatMap((user: User) => {
        return this._backandService.getContributorSchemeFavorites(user.contributor)
          .flatMap((favoriteSchemes: any) => {
            return this._backandService.getSchemes().map((schemes: Scheme[]) => {
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
              this._schemes = schemes;
              return this._schemes;
            });
          });
      });
    return this._schemesObservable;
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
    if (this._teams) {
      return Observable.of(this._teams);
    }
    if (this._teamsObservable) {
      return this._teamsObservable;
    }
    this._teamsObservable = this._backandService.getTeams()
      .map((teams: Team[]) => {
        this._teams = teams;
        return this._teams;
      });
    return this._teamsObservable;
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
    this._teamsOfContributorObservable = this.getTeams()
      .flatMap((teams: Team[]) => {
        /* this.getUser()
        .flatMap( (user: User) => { */
        return this._backandService.getTeamsOfContributor(contributor)
          .map((userTeamNumbers: number[]) => {
            const userTeams: Team[] = [];
            userTeamNumbers.forEach(userTeamNumber => {
              const teamOfUser = teams.find((team: Team, index: number) => {
                return team.id === userTeamNumber;
              });
              if (teamOfUser !== undefined) {
                userTeams.push(teamOfUser);
              }
            });
            return userTeams;
          });
        // });
      })
      .map((teams: Team[]) => {
        this._teamsOfContributor = teams;
        return this._teamsOfContributor;
      });

    return this._teamsOfContributorObservable;
  }

  addSchemeToFavorites(schemeId: number) {
    return this._backandService.addSchemeToFavorites(schemeId).do(() => {
      const changedSchemeIndex = this._schemes.findIndex((scheme) => {
        if (scheme.id === schemeId) {
          return true;
        }
      });
      this._schemes[changedSchemeIndex].isFavorite = true;
    });
  }

  removeSchemeFromFavorites(schemeId: number) {
    return this._backandService.removeSchemeFromFavorites(schemeId).do(() => {
      const changedSchemeIndex = this._schemes.findIndex((scheme) => {
        if (scheme.id === schemeId) {
          return true;
        }
      });
      this._schemes[changedSchemeIndex].isFavorite = false;
    });
  }

  getCategories(): Observable<{ id: number; name: string; }[]> {
    return this._backandService.getCategories();
  }
  getPlaces(): Observable<{ id: number; name: string; }[]> {
    return this._backandService.getPlaces();
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
