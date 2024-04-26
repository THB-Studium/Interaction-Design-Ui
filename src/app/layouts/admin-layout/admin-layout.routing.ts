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
  {path: 'bookings', component: BookingComponent},
  //#region country
  {path: 'countries', component: CountryComponent},
  {path: 'countries/edit/:id', component: EditCountryComponent},
  //#endregion country
  {path: 'feedbacks', component: FeedbackComponent},
  {path: 'startpage', component: HomeComponent},
  {path: 'travelers', component: TravelerComponent},
  {path: 'tripoffers', component: TripofferComponent},
  {path: 'tripoffers/edit/:id', component: EditTripofferComponent},
  {path: 'tripoffer/view/:landId', component: LearnMoreComponent},
  {path: 'users', component: AdminComponent},
  {path: 'user-profile', component: UserProfileComponent},
  {path: 'verwaltung', component: DashboardComponent},
];
