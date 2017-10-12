import { Team } from './team.model';
import { User } from './user.model';
import { Observable } from 'rxjs/Rx';

import { Scheme } from './scheme.model';

export interface DataServiceModel {
    getSchemes(): Observable<Scheme[]>;
    getScheme(id: number): Observable<Scheme>;
    getCategories(): Observable<{id: number, name: string}[]>;
    getPlaces(): Observable<{ id: number, name: string }[]>;
    getUser(): Observable<User>;
    getTeam(): Observable<Team[]>;
    getTeamsOfContributor(contributor?: number): Observable<Team[]>;

    addSchemeToFavorites(schemeId: number);
    removeSchemeFromFavorites(schemeId: number);
}
