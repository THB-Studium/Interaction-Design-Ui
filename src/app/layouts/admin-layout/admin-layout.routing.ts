import {Routes} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {PageNames, RoutingPaths} from '../../shared/const';


const providers = [
  {provide: LocationStrategy, useClass: HashLocationStrategy}
];

const admin_layout_routes: Routes = [
  {
    path: RoutingPaths.VERWALTUNG,
    title: PageNames.BASE_NAME + 'Verwaltung',
    loadComponent: () => import('../../pages/dashboard/dashboard.component')
      .then(item => item.DashboardComponent)
  },
  {
    path: RoutingPaths.BOOKING,
    title: PageNames.BASE_NAME + 'Booking',
    loadComponent: () => import('src/app/pages/booking/booking.component')
      .then(item => item.BookingComponent)
  },

  //#region country
  {
    path: RoutingPaths.COUNTRY,
    title: PageNames.BASE_NAME + 'Country',
    loadComponent: () => import('src/app/pages/country/country.component')
      .then(item => item.CountryComponent)
  },

  {
    path: RoutingPaths.COUNTRY_EDIT_ITEM,
    title: PageNames.BASE_NAME + 'Edit Country',
    loadComponent: () => import('src/app/pages/edit-country/edit-country.component')
      .then(item => item.EditCountryComponent)
  },

  //#endregion country
  {
    path: RoutingPaths.FEEDBACKS,
    title: PageNames.BASE_NAME + 'Feedback',
    loadComponent: () => import('src/app/pages/feedback/feedback.component')
      .then(item => item.FeedbackComponent)
  },
  {
    path: RoutingPaths.ADMIN_HOME,
    title: PageNames.BASE_NAME + 'Home',
    loadComponent: () => import('src/app/pages/home/home.component')
      .then(item => item.HomeComponent)
  },
  {
    path: RoutingPaths.TRAVELERS,
    title: PageNames.BASE_NAME + 'Traveler',
    loadComponent: () => import('src/app/pages/traveler/traveler.component')
      .then(item => item.TravelerComponent)
  },
  {
    path: RoutingPaths.TRIP_OFFERS,
    title: PageNames.BASE_NAME + 'Trip Offer',
    loadComponent: () => import('src/app/pages/tripoffer/tripoffer.component')
      .then(item => item.TripofferComponent)
  },
  {
    path: RoutingPaths.TRIP_OFFERS_EDIT_ITEM,
    title: PageNames.BASE_NAME + 'Edit Trip Offer',
    loadComponent: () => import('src/app/pages/edit-tripoffer/edit-tripoffer.component')
      .then(item => item.EditTripofferComponent)
  },
  {
    path: RoutingPaths.TRIP_OFFERS_VIEW_ITEM,
    title: PageNames.BASE_NAME + 'View Trip Offer',
    loadComponent: () => import('src/app/pages/learn-more/learn-more.component')
      .then(item => item.LearnMoreComponent)
  },
  {
    path: RoutingPaths.USERS,
    title: PageNames.BASE_NAME + 'Admin',
    loadComponent: () => import('../../pages/admins/admin.component')
      .then(item => item.AdminComponent)
  },
  {
    path: RoutingPaths.USERS_PROFILE,
    title: PageNames.BASE_NAME + 'User Profile',
    loadComponent: () => import('../../pages/user-profile/user-profile.component')
      .then(item => item.UserProfileComponent)
  }
];


export default [{
  path: '',
  providers: providers,
  loadComponent: () => import('./admin-layout.component').then(item => item.AdminLayoutComponent),
  children: admin_layout_routes
}] as Routes;
