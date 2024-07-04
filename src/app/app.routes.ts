import {Routes} from '@angular/router';
import {isAuthenticated} from './services/authorization/authorization.guard';


export const routes: Routes = [
  // ::: DEFAULT :::
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', pathMatch: 'full', redirectTo: 'home'},

  // ::: PRIVATE :::
  {
    path: '',
    canActivate: [isAuthenticated],
    loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.routing')
  },

  // ::: PUBLIC :::
  {
    path: '',
    loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.routing')
  },
  {
    path: '',
    title: 'Client - ',
    loadChildren: () => import('src/app/layouts/home-layout/home-layout.routing')
  }
];
