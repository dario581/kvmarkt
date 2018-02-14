import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { KvmarktUserModule } from './kvmarkt-user/kvmarkt-user.module';
import { AuthService } from './service/auth.service';
import { AuthGuardService } from './service/auth-guard.service';
import { ErrorService } from './service/error.service';
import { SchemeStore, PlaceStore, CategoryStore, UserStore } from './model/store';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot([
      /* {
        path: 'schemes',
        component: HeroesComponent
      } */
    ]),

    KvmarktUserModule
  ],
  providers: [
    AuthService
    , AuthGuardService
    , ErrorService
    , SchemeStore
    , CategoryStore
    , PlaceStore
    , UserStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
