import { BackandService } from '../../service/backand.service';
import { DataService } from '../../service/data.service';
import { Component, OnInit } from '@angular/core';
import { Blogpost } from '../../model/blogpost.model';
import { Scheme } from '../../model/scheme.model';
import { User } from '../../model/user.model';
import { SchemeStore, CategoryStore, PlaceStore, UserStore } from '../../model/store/BaseStore';

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

  user_firstname: string;

  favSchemes: Scheme[];
  ownSchemes: Scheme[] = null;

  constructor(
    private _backandService: BackandService
    , private _schemeStore: SchemeStore
    , private _categoryStore: CategoryStore
    , private _placeStore: PlaceStore
    , private _userStore: UserStore
  ) { }

  getBlogposts() {
    this._backandService.getBlogposts()
      .subscribe(
      bp => this.blogposts = bp,
      error => this.errorMessage = <any>error);
  }

  ngOnInit() {
    this.getBlogposts();
    this._schemeStore
      .getItems(true)
      .distinct()
      .subscribe(
      (schemes: Scheme[]) => {
        this.favSchemes = schemes
          .filter((scheme) => {
            return scheme.isFavorite;
          })
          .slice(0, 2);
      }
      );

    this._userStore
      .getItem()
      .distinct()
      .subscribe((user: User) => {
        const filter = [{ fieldName: 'author', operator: 'in', value: '' + user.contributor }];
        this._schemeStore.getItems(true, 1, 3, filter).subscribe((schemes: Scheme[]) => {
          this.ownSchemes = schemes;
          // schemes = schemes.filter((scheme, index) => {
          //   if (+scheme.author === user.contributor) {
          //     return scheme;
          //   }
          // });
          // if (schemes.length > 3) {
          //   schemes = schemes.slice(0, 3);
          // }
          // this.ownSchemes = schemes;
          // console.timeEnd('Dashboard get Schemes');
        });
      });
    this.hint = 'Wird geladen...';
    this._backandService.getUser().subscribe(user => this.user_firstname = user.firstname);
    // localStorage.getItem('backand_user_firstname');
  }
}
