import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Scheme } from '../../../model/scheme.model';
import { BackandService } from '../../../service/backand.service';
import { DataService } from '../../../service/data.service';
import { SchemeStore } from '../../../model/store/BaseStore';

@Component({
  selector: 'app-scheme-detail',
  templateUrl: './scheme-detail.component.html',
  styleUrls: ['./scheme-detail.component.css']
})
export class SchemeDetailComponent implements OnInit {

  scheme: Scheme;
  tagList: Array<{ name: string, id: number }> = [];

  constructor(private route: ActivatedRoute, private schemeStore: SchemeStore,
    private _dataService: DataService, private location: PlatformLocation) {
    location.onPopState(() => {
      console.log('back');
      return false;
    });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const id = +params['id'];
      this.schemeStore.getItem(id).subscribe(data => this.init(data));
      /* this.backandService.getTags().subscribe(() => {
        this.backandService.getSchemeTags(id).subscribe(data => this.tagList = data);
      }); // TODO: add tag_name to database table "scheme_tags" and only fetch them */
    });
  }

  public init(data: Scheme) {
    this.scheme = data;
  }

  public toggleSchemeLiked() {
    if (this.scheme.isFavorite) {
      this._dataService.removeSchemeFromFavorites(this.scheme.id).subscribe((data) => {
        this._dataService.getScheme(this.scheme.id).subscribe((scheme) => {
          this.scheme = scheme;
        });
      });
    } else {
      this._dataService.addSchemeToFavorites(this.scheme.id).subscribe((data) => {
        this._dataService.getScheme(this.scheme.id).subscribe((scheme) => {
          this.scheme = scheme;
        });
      });
    }
  }

  printPage() {
    window.print();
  }

}
