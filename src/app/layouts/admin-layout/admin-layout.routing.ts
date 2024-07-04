import {Routes} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';


const base_title_name: string = 'Admin Dashboard - ';

const providers = [
  {provide: LocationStrategy, useClass: HashLocationStrategy}
]

const admin_layout_routes: Routes = [
  {
    path: 'verwaltung',
    title: base_title_name + 'Verwaltung',
    loadComponent: () => import('../../pages/dashboard/dashboard.component')
      .then(item => item.DashboardComponent)
  },
  {
    path: 'bookings',
    title: base_title_name + 'Booking',
    loadComponent: () => import('src/app/pages/booking/booking.component')
      .then(item => item.BookingComponent)
  },

  //#region country
  {
    path: 'countries',
    title: base_title_name + 'Country',
    loadComponent: () => import('src/app/pages/country/country.component')
      .then(item => item.CountryComponent)
  },

  {
    path: 'countries/edit/:id',
    title: base_title_name + 'Edit Country',
    loadComponent: () => import('src/app/pages/edit-country/edit-country.component')
      .then(item => item.EditCountryComponent)
  },

  //#endregion country
  {
    path: 'feedbacks',
    title: base_title_name + 'Feedback',
    loadComponent: () => import('src/app/pages/feedback/feedback.component')
      .then(item => item.FeedbackComponent)
  },
  {
    path: 'startpage',
    title: base_title_name + 'Home',
    loadComponent: () => import('src/app/pages/home/home.component')
      .then(item => item.HomeComponent)
  },
  {
    path: 'travelers',
    title: base_title_name + 'Traveler',
    loadComponent: () => import('src/app/pages/traveler/traveler.component')
      .then(item => item.TravelerComponent)
  },
  {
    path: 'tripoffers',
    title: base_title_name + 'Trip Offer',
    loadComponent: () => import('src/app/pages/tripoffer/tripoffer.component')
      .then(item => item.TripofferComponent)
  },
  {
    path: 'tripoffers/edit/:id',
    title: base_title_name + 'Edit Trip Offer',
    loadComponent: () => import('src/app/pages/edit-tripoffer/edit-tripoffer.component')
      .then(item => item.EditTripofferComponent)
  },
  {
    path: 'tripoffer/view/:landId',
    title: base_title_name + 'View Trip Offer',
    loadComponent: () => import('src/app/pages/learn-more/learn-more.component')
      .then(item => item.LearnMoreComponent)
  },
  {
    path: 'users',
    title: base_title_name + 'Admin',
    loadComponent: () => import('../../pages/admins/admin.component')
      .then(item => item.AdminComponent)
  },
  {
    path: 'user-profile',
    title: base_title_name + 'User Profile',
    loadComponent: () => import('../../pages/user-profile/user-profile.component')
      .then(item => item.UserProfileComponent)
  }
]


export default [{
  path: '',
  providers: providers,
  loadComponent: () => import('./admin-layout.component').then(item => item.AdminLayoutComponent),
  children: admin_layout_routes
}] as Routes;
