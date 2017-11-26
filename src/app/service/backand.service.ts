import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/concat';
import { Blogpost } from '../model/blogpost.model';
import { Scheme } from '../model/scheme.model';
import { Team } from '../model/team.model';
import { User } from '../model/user.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { DataError } from './data.error';

@Injectable()
export class BackandService {

  auth_token: { header_name: string, header_value: string } = { header_name: '', header_value: '' };
  api_url = 'https://api.backand.com';
  app_name = 'cvjs';
  auth_type = 'N/A';
  auth_status = '';
  is_auth_error = false;

  private scheme_tags: any = null;
  private scheme_categories: any[] = null;
  private scheme_places: any = null;
  private _tagSubject: any;

  private categoryObservable: Observable<any>;

  private blogposts: Blogpost[];
  private blogpostsObservable: Observable<Blogpost[]>;

  constructor(public http: Http, private router: Router) { }


  public getBlogposts(): Observable<any> {
    if (this.blogposts) {
      return Observable.of(this.blogposts);
    }
    if (this.blogpostsObservable) {
      return this.blogpostsObservable;
    }
    this.blogpostsObservable = this.http.get(this.api_url + '/1/objects/cvjs_blogpost', {
      headers: this.authHeader
    })
      .map((data) => {
        this.blogposts = this.extractData(data);
        return this.blogposts;
      })
      .catch(this.handleError);
    return this.blogpostsObservable;
  }

  public getSchemes(): Observable<any> {
    const data = [{ fieldName: 'status', operator: 'equals', value: 'published' }];
    const params = new URLSearchParams();
    params.set('filter', JSON.stringify(data));
    return this.http.get(this.api_url + '/1/objects/schemes', {
      headers: this.authHeader,
      search: params
    })
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getSchemesPage(pageSize: number, pageNumber: number): Observable<any> {
    const filter = [
      { fieldName: 'status', operator: 'equals', value: 'published' },
    ];
    const params = new URLSearchParams();
    params.set('pageSize', pageSize.toString());
    params.set('pageNumber', pageNumber.toString());
    params.set('filter', JSON.stringify(filter));
    return this.http.get(this.api_url + '/1/objects/schemes', {
      headers: this.authHeader,
      search: params
    })
      .map(this.extractBody)
      .catch(this.handleError);
  }

  /* public getFavSchemes(size: number) {
      let params = new URLSearchParams();
      params.set('parameters', '{contributor: ' + localStorage.getItem('backand_user_id') + '}' );
      return this.http.get(this.api_url + '/1/query/data/schemes_contributor_favorites', {
          headers: this.authHeader,
          search: params
      })
      .map(this.extractBody)
      .catch(this.handleError);
  } */

  getContributorSchemeFavorites(contributor: number): Observable<number[]> {
    const defaultFilter = [
      { fieldName: 'contributor', operator: 'in', value: '' + contributor },
    ];
    const params = new URLSearchParams();
    params.set('filter', JSON.stringify(defaultFilter));

    const observable = this.http.get(this.api_url + '/1/objects/contributor_favoriteSchemes', {
      headers: this.authHeader,
      search: params
    })
      .map(response => {
        const data = this.extractData(response);
        return data;
      })
      .catch(this.handleError);
    return observable;
  }

  public getSchemesFiltered(pageSize: number, pageNumber: number, filter: any): Observable<any> {
    let defaultFilter = [
      { fieldName: 'status', operator: 'equals', value: 'published' },
    ];
    defaultFilter = defaultFilter.concat(filter);
    const params = new URLSearchParams();
    params.set('pageSize', pageSize.toString());
    params.set('pageNumber', pageNumber.toString());
    params.set('filter', JSON.stringify(defaultFilter));
    return this.http.get(this.api_url + '/1/objects/schemes', {
      headers: this.authHeader,
      search: params
    })
      .map(this.extractBody)
      .catch(this.handleError);
  }

  /**
   * Currently main function to get schemes
  */
  public getSchemesByCategory(pageSize: number, pageNumber: number, categories: number[], place: number,
    age_start: number, age_end: number, sortingFieldName: string, sortingAsc: boolean): Observable<any> {
    const defaultFilter = [
      { fieldName: 'status', operator: 'greaterThanOrEqualsTo', value: '4' },
    ];

    categories.forEach(category => {
      if (category && category !== 0) {
        defaultFilter.push({
          fieldName: 'category', operator: 'in', value: '' + category
        });
      }
    });

    if (age_start && age_start !== 0) {
      defaultFilter.push({
        fieldName: 'age_start', operator: 'greaterThanOrEqualsTo', value: '' + age_start
      });
    }
    if (age_end && age_end !== 20) {
      defaultFilter.push({
        fieldName: 'age_end', operator: 'lessThanOrEqualsTo', value: '' + age_end
      });
    }

    if (place && place !== 0) {
      defaultFilter.push({
        fieldName: 'place', operator: 'in', value: '' + place
      });
    }

    let sorting: any = [];
    if (sortingFieldName) {
      const sortingOrderString = sortingAsc ? 'asc' : 'desc';
      sorting = [{
        fieldName: sortingFieldName,
        order: sortingOrderString
      }];
    }

    const params = new URLSearchParams();
    params.set('pageSize', pageSize.toString());
    params.set('pageNumber', pageNumber.toString());
    params.set('filter', JSON.stringify(defaultFilter));
    params.set('sort', JSON.stringify(sorting));
    return this.http.get(this.api_url + '/1/objects/schemes', {
      headers: this.authHeader,
      search: params
    })
      .map(this.extractBody)
      .catch(this.handleError);
  }

  public getScheme(id: number): Observable<any> {
    return this.http.get(this.api_url + '/1/objects/schemes/' + id, {
      headers: this.authHeader,
    })
      .map(this.extractBody)
      .catch(this.handleError);
  }

  public addScheme(scheme: Scheme) {
    const body = JSON.stringify(scheme);
    const options = new RequestOptions({ headers: this.authHeader, search: 'returnObject=true' });

    return this.http.post(this.api_url + '/1/objects/schemes', body, options)
      .map(this.extractBody)
      .catch(this.handleError);
  }

  public addSchemeTags(scheme_id: number, tagsOfScheme: number[]) {
    const data = { tags: tagsOfScheme, scheme: scheme_id, batch: true };
    const body = JSON.stringify(data);
    const options = new RequestOptions({ headers: this.authHeader, search: 'returnObject=true' });

    return this.http.post(this.api_url + '/1/objects/scheme_tagsOfScheme', body, options)
      .map(this.extractBody)
      .catch(this.handleError);
  }

  public addSchemeToFavorites(favoriteSchemeId: number): Observable<number> {
    const object = {
      'scheme': favoriteSchemeId
    };
    const body = JSON.stringify(object);
    const options = new RequestOptions({ headers: this.authHeader }); // , search: 'returnObject=true'

    return this.http.post(this.api_url + '/1/objects/contributor_favoriteSchemes', body, options)
      .map(this.extractBody)
      .catch(this.handleError);
  }

  public removeSchemeFromFavorites(schemeId: number): Observable<number> {
    const params = new URLSearchParams();
    params.set('parameters', '{scheme: "' + schemeId + '"}');

    return this.http.get(localStorage.getItem('backand_url') + '/1/query/data/removeFavoriteScheme', {
      headers: this.authHeader,
      search: params
    })
      .map((data) => {
        data = this.extractBody(data);
        return data;
      })
      .catch(this.handleError);
  }

  /* TAGS */
  get tagSubject(): any {
    return this._tagSubject.asObservable();
  }

  public loadAllTags() {
    this.http.get(this.api_url + '/1/objects/scheme_tags', {
      headers: this.authHeader
    })
      .map(this.extractData)
      .catch(this.handleError)
      .subscribe(data => {
        this.scheme_tags = data;
        this._tagSubject.next(this.scheme_tags);
      });
  }

  public getTags() {
    if (this.scheme_tags) {
      return Observable.of(this.scheme_tags);
    }
    return this.http.get(this.api_url + '/1/objects/scheme_tags', {
      headers: this.authHeader
    })
      .map(response => {
        const data = this.extractData(response);
        this.scheme_tags = data;
        return this.scheme_tags;
      })
      .catch(this.handleError);
  }

  public getTag(id: number) {
    for (let i = 0; i < this.scheme_tags.length; i++) {
      if (this.scheme_tags[i].id === id) {
        return this.scheme_tags[i].name;
      }
    }
  }

  public getSchemeTags(scheme_id: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('filter', '{fieldName: "scheme", operator: "in", value: "' + scheme_id + '"}');
    return this.http.get(this.api_url + '/1/objects/scheme_tagsOfScheme', {
      search: params,
      headers: this.authHeader
    })
      .map(data => {
        const tagIdList = this.extractData(data);
        const tagList: Array<{ name: string, id: number }> = new Array();
        for (let i = 0; i < tagIdList.length; i++) {
          tagList.push({
            name: this.getTag(+tagIdList[i].tag),
            id: +tagIdList[i].tag
          });
        }
        return tagList;
      })
      .catch((err) => this.handleError(err));
  }

  /** CATEGORIES */
  public getPlaces() {
    if (this.scheme_places) {
      return Observable.of(this.scheme_places);
    }
    return this.http.get(this.api_url + '/1/objects/scheme_places', {
      headers: this.authHeader
    })
      .map(response => {
        const data = this.extractData(response);
        this.scheme_places = data;
        return this.scheme_places;
      })
      .catch((err) => this.handleError(err));
  }

  /** PLACES */
  public getCategories() {
    if (this.scheme_categories) {
      return Observable.of(this.scheme_categories);
    }
    if (this.categoryObservable) {
      return this.categoryObservable;
    }
    this.categoryObservable = this.http.get(this.api_url + '/1/objects/scheme_categories', {
      headers: this.authHeader
    })
      .map(response => {
        this.categoryObservable = null;
        const data = this.extractData(response);
        this.scheme_categories = data;
        return this.scheme_categories;
      })
      .catch((err) => this.handleError(err));
    return this.categoryObservable;
  }

  public getCategory(id: number) {
    /*if (this.scheme_categories) {
        return Observable.of(this.scheme_categories.find(data => data.id === id));
    }
    if (this.categoryObservable) {
        return this.categoryObservable.filter(cat => cat.id === id);
    }*/
    return this.getCategories()
      .map(cats => {
        const category = cats.find((cat: any) => cat.id === id);
        if (category !== undefined) {
          return category;
        }
      }).do(cat => console.log('cat', cat));
    // .do(cat => console.log('cat', cat)).filter(cat => cat.id === id);
  }

  /* other */
  get tokenUrl() {
    return this.api_url + '/token';
  }

  public signIn(user: string, pass: string) {
    this.auth_type = 'Token';
    // let http = Http;
    const creds = `username=${user}` +
      `&password=${pass}` +
      `&appName=${this.app_name}` +
      `&grant_type=password`;
    const header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.tokenUrl, creds, {
      headers: header
    })
      .map(res => {
        this._setToken(res);
        return this.extractBody(res);
      })
      .catch(err => this.handleError(err));
  }

  private _setTokenHeader(jwt: any) {
    if (jwt) {
      this.auth_token.header_name = 'Authorization';
      this.auth_token.header_value = 'Bearer ' + jwt;
    }
  }

  private _setToken(res: any) {
    const jwt = res.json().access_token;
    localStorage.setItem('backand_token', jwt);
    this._setTokenHeader(jwt);
    return jwt;
  }

  private get authHeader() {
    const authHeader = new Headers();
    if (localStorage.getItem('backand_token')) {
      this._setTokenHeader(localStorage.getItem('backand_token'));
      authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
    }
    return authHeader;
  }

  private extractData(res: Response) {
    const body = res.json();
    console.log(body);
    const result = body.data;
    return result || {};
  }

  private extractBody(res: Response) {
    console.log(res.json());
    return res.json() || {};
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    console.log('Error Status', error);
    const backandErrorMessage = error.json().error;
    console.log(backandErrorMessage);
    this.router.navigate(['/login']);
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error('Backand Error message: ' + errMsg); // log to console instead
    // console.log('Error content: ' + error.body);
    return Observable.throw(errMsg);
  }

  getTeamsOfContributor(contributor: number): Observable<number[]> {
    return Observable.of([1, 2, 3]);
  }

  getTeams(): Observable<Team[]> {
    const teamsObservable = this.http.get(this.api_url + '/1/objects/team', {
      headers: this.authHeader
    })
      .map(response => {
        const data = this.extractData(response);
        return data;
      })
      .catch(this.handleError);
    return teamsObservable;
  }

  private user: User;
  private userObservable: Observable<User>;

  public getUser(): Observable<User> {

    if (this.user) {
      return Observable.of(this.user);
    }

    if (this.userObservable) {
      return this.userObservable;
    }

    if (!localStorage.getItem('backand_token') || !localStorage.getItem('backand_username')) {
      // throw new Error('No User found');
    }

    const header = new Headers();
    header.append('Authorization', 'Bearer ' + localStorage.getItem('backand_token'));

    const params = new URLSearchParams();
    params.set('parameters', '{username: "' + localStorage.getItem('backand_username') + '"}');
    console.log('BackandService getUser');

    this.userObservable = this.http.get(localStorage.getItem('backand_url') + '/1/query/data/userdetail', {
      headers: header,
      search: params
    })
      .map((data) => {
        const users = this.extractBody(data);
        console.log('Auth Data: ', users);
        this.user = users[0];
        return this.user;
      })
      .catch((error) => {
        return Observable.throw(new DataError(401, 'error'));
      });

    return this.userObservable;
  }
}
