import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KvmarktUserComponent } from './kvmarkt-user.component';
import { SchemeDetailComponent } from './schemes/scheme-detail/scheme-detail.component';
import { SchemesComponent } from './schemes/schemes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../service/auth-guard.service';
import { SchemeCreateComponent } from './schemes/scheme-create/scheme-create.component';

const routes: Routes = [];


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  {
    path: '', component: KvmarktUserComponent, canActivate: [AuthGuardService], canActivateChild: [AuthGuardService], children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Home' } },
      {
        path: 'schemes', component: SchemesComponent, data: { title: 'Programme' } }, // , children: [
          // { path: '', component: SchemeListComponent, data: { title: 'Programme' } },
      { path: 'schemes/favorites', component: SchemesComponent, data: { title: 'Favoriten' } },
      { path: 'schemes/create', component: SchemeCreateComponent, data: { title: 'Programm erstellen' } },
      { path: 'schemes/start', component: SchemesComponent, data: { title: 'Programme entdecken' } },
      { path: 'schemes/:id', component: SchemeDetailComponent, data: { title: 'Programm Details' } },
        // ]
      // },
      /* {
        path: 'profile', component: ProfileContainerComponent, data: { title: 'Profil' }, children: [
          { path: '', component: UserComponent },
          { path: 'association/:id', component: AssociationComponent, data: { title: 'Verein' } },
        ]
      }, */
    ]
  },
];

@NgModule({
  imports: [  RouterModule.forChild(appRoutes)  ],
  exports: [  RouterModule                      ]
})
export class KvmarktUserRoutingModule { }
