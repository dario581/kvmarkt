import { HttpModule, JsonpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';

import { DashboardComponent } from './dashboard/dashboard.component';
import { KvmarktUserRoutingModule } from './kvmarkt-user-routing.module';
import { KvmarktUserComponent } from './kvmarkt-user.component';
import { SchemeCardComponent } from './schemes/scheme-card/scheme-card.component';
import { SchemeCreateComponent } from './schemes/scheme-create/scheme-create.component';
import { SchemeDetailComponent } from './schemes/scheme-detail/scheme-detail.component';
import { SchemesComponent } from './schemes/schemes.component';
import { LoginComponent } from './login/login.component';

import { OAuthModule } from 'angular-oauth2-oidc';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    KvmarktUserRoutingModule,
    QuillEditorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    KvmarktUserComponent,
    SchemesComponent,
    SchemeDetailComponent,
    SchemeCreateComponent,
    SchemeCardComponent,
    DashboardComponent,
    LoginComponent
  ]
})
export class KvmarktUserModule { }
