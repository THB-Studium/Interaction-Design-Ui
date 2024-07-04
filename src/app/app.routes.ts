import {Routes} from '@angular/router';
import {isAuthenticated} from './services/authorization/authorization.guard';
import {RoutingPaths} from './shared/const';


export const routes: Routes = [
  // ::: DEFAULT :::
  {path: '', redirectTo: RoutingPaths.HOME, pathMatch: 'full'},
  {path: '**', redirectTo: RoutingPaths.HOME},

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
    loadChildren: () => import('src/app/layouts/home-layout/home-layout.routing')
  }
];
