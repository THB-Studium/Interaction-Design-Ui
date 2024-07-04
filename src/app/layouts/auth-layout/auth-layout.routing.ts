import {Routes} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {DateFormat, PageNames, RoutingPaths} from '../../shared/const';


const providers = [
  { provide: LocationStrategy, useClass: HashLocationStrategy },
  {
    provide: MAT_DATE_FORMATS,
    useValue: DateFormat.PARSE_AND_DISPLAY,
  },
]

const aut_layout_routes: Routes = [
  {
    path: RoutingPaths.LOGIN,
    title: PageNames.BASE_NAME + 'Login',
    loadComponent: () => import('../../pages/login/login.component')
      .then(item => item.LoginComponent)
  },
  {
    path: RoutingPaths.LOGOUT,
    title: PageNames.BASE_NAME + 'Logout',
    loadComponent: () => import('src/app/pages/logout/logout.component')
      .then(item => item.LogoutComponent)
  },
  {
    path: RoutingPaths.LEARN_MORE_ITEM,
    title: PageNames.BASE_NAME + 'Land',
    loadComponent: () => import('../../pages/learn-more/learn-more.component')
      .then(item => item.LearnMoreComponent)
  },
  {
    path: RoutingPaths.ABOUT_US,
    title: PageNames.BASE_NAME + 'About Us',
    loadComponent: () => import('src/app/pages/aboutus/aboutus.component')
      .then(item => item.AboutusComponent)
  }
]


export default [{
  path: '',
  providers: providers,
  loadComponent: () => import('./auth-layout.component').then(item => item.AuthLayoutComponent),
  children: aut_layout_routes
}] as Routes;
