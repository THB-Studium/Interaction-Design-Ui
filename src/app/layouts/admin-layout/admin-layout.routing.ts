import {Routes} from '@angular/router';

import {AdminComponent} from '../../pages/admins/admin.component';
import {BookingComponent} from 'src/app/pages/booking/booking.component';
import {CountryComponent} from 'src/app/pages/country/country.component';
import {DashboardComponent} from '../../pages/dashboard/dashboard.component';
import {EditCountryComponent} from 'src/app/pages/edit-country/edit-country.component';
import {EditTripofferComponent} from 'src/app/pages/edit-tripoffer/edit-tripoffer.component';
import {FeedbackComponent} from 'src/app/pages/feedback/feedback.component';
import {HomeComponent} from 'src/app/pages/home/home.component';
import {LearnMoreComponent} from 'src/app/pages/learn-more/learn-more.component';
import {TravelerComponent} from 'src/app/pages/traveler/traveler.component';
import {TripofferComponent} from 'src/app/pages/tripoffer/tripoffer.component';
import {UserProfileComponent} from '../../pages/user-profile/user-profile.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'bookings',
    title: 'Booking',
    component: BookingComponent
  },

  //#region country
  {
    path: 'countries',
    title: 'Country',
    component: CountryComponent
  },

  {
    path: 'countries/edit/:id',
    title: 'Edit Country',
    component: EditCountryComponent
  },

  //#endregion country
  {
    path: 'feedbacks',
    title: 'Feedback',
    component: FeedbackComponent
  },
  {
    path: 'startpage',
    title: 'Home',
    component: HomeComponent
  },
  {
    path: 'travelers',
    title: 'Traveler',
    component: TravelerComponent
  },
  {
    path: 'tripoffers',
    title: 'Trip Offer',
    component: TripofferComponent
  },
  {
    path: 'tripoffers/edit/:id',
    title: 'Edit Trip Offer',
    component: EditTripofferComponent
  },
  {
    path: 'tripoffer/view/:landId',
    title: 'View Trip Offer',
    component: LearnMoreComponent
  },
  {
    path: 'users',
    title: 'Admin',
    component: AdminComponent
  },
  {
    path: 'user-profile',
    title: 'User Profile',
    component: UserProfileComponent
  },
  {
    path: 'verwaltung',
    title: 'Verwaltung',
    component: DashboardComponent
  },
];
