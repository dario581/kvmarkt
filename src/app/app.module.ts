import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { KvmarktUserModule } from './kvmarkt-user/kvmarkt-user.module';
import { DataService } from './service/data.service';
import { BackandService } from './service/backand.service';
import { AuthService } from './service/auth.service';
import { AuthGuardService } from './service/auth-guard.service';
import { ErrorService } from './service/error.service';
import { SchemeStore, SchemeFavoriteStore } from './model/store/BaseStore';

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
  providers: [DataService, BackandService, AuthService, AuthGuardService, ErrorService, SchemeStore, SchemeFavoriteStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
