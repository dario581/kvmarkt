import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Scheme } from '../../../model/scheme.model';
import { BackandService } from '../../../service/backand.service';
import { SchemeStore } from '../../../model/store/BaseStore';

@Component({
  selector: 'app-scheme-detail',
  templateUrl: './scheme-detail.component.html'
})
export class SchemeDetailComponent implements OnInit {

  scheme: Scheme;
  tagList: Array<{ name: string, id: number }> = [];
  user_association: string;

  constructor(private route: ActivatedRoute,
    private schemeStore: SchemeStore,
    private location: PlatformLocation
  ) {
    location.onPopState(() => {
      console.log('back');
      return false;
    });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const id = +params['id'];
      this.schemeStore.getItem(id).subscribe(data => this.init(data));
      this.user_association = localStorage.getItem('backand_user_association_name');
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
    //   this..removeSchemeFromFavorites(this.scheme.id).subscribe((data) => {
    //     this..getScheme(this.scheme.id).subscribe((scheme) => {
    //       this.scheme = scheme;
    //     });
    //   });
    // } else {
    //   this..addSchemeToFavorites(this.scheme.id).subscribe((data) => {
    //     this..getScheme(this.scheme.id).subscribe((scheme) => {
    //       this.scheme = scheme;
    //     });
    //   });
    }
  }

  printPage() {
    window.print();
  }

}
