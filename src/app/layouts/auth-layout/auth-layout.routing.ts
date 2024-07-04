import {Routes} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {MAT_DATE_FORMATS} from '@angular/material/core';


const base_title_name: string = 'Authentication - ';

const providers = [
  { provide: LocationStrategy, useClass: HashLocationStrategy },
  {
    provide: MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: 'YYYY-MM-DD',
      },
      display: {
        dateInput: 'DD MMM, YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    },
  },
]

const aut_layout_routes: Routes = [
  {
    path: 'learn-more/:landId',
    title: base_title_name + 'Land',
    loadComponent: () => import('../../pages/learn-more/learn-more.component')
      .then(item => item.LearnMoreComponent)
  },
  {
    path: 'login',
    title: base_title_name + 'Login',
    loadComponent: () => import('../../pages/login/login.component')
      .then(item => item.LoginComponent)
  },
  {
    path: 'logout',
    title: base_title_name + 'Logout',
    loadComponent: () => import('src/app/pages/logout/logout.component')
      .then(item => item.LogoutComponent)
  },
  {
    path: 'aboutus',
    title: base_title_name + 'About Us',
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
