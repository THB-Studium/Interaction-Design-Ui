import {Routes} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';


const base_title_name: string = 'Client - ';

const providers = [
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];

const home_layout_routes: Routes = [
  {
    path: 'home',
    title: base_title_name + 'Home',
    loadComponent: () => import('src/app/pages/home/home.component').then(item => item.HomeComponent)
  }
];


export default [{
  path: '',
  providers: providers,
  loadComponent: () => import('./home-layout.component').then(item => item.HomeLayoutComponent),
  children: home_layout_routes
}] as Routes;
