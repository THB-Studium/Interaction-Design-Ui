import { Routes } from "@angular/router";

import { AdminComponent } from "../../pages/admins/admin.component";
import { AuthorizationGuard } from "src/app/services/authorization/authorization.guard";
import { BookingComponent } from "src/app/pages/booking/booking.component";
import { CountryComponent } from "src/app/pages/country/country.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { EditCountryComponent } from "src/app/pages/edit-country/edit-country.component";
import { EditTripofferComponent } from "src/app/pages/edit-tripoffer/edit-tripoffer.component";
import { FeedbackComponent } from "src/app/pages/feedback/feedback.component";
import { HomeComponent } from "src/app/pages/home/home.component";
import { LearnMoreComponent } from "src/app/pages/learn-more/learn-more.component";
import { TravelerComponent } from "src/app/pages/traveler/traveler.component";
import { TripofferComponent } from "src/app/pages/tripoffer/tripoffer.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { NewsletterComponent } from "src/app/pages/newsletter/newsletter.component";
import { MailingListComponent } from "src/app/pages/mailing-list/mailing-list.component";

export const AdminLayoutRoutes: Routes = [
  {
    path: "bookings",
    component: BookingComponent,
    canActivate: [AuthorizationGuard],
  },
  //#region country
  {
    path: "countries",
    component: CountryComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "countries/edit/:id",
    component: EditCountryComponent,
    canActivate: [AuthorizationGuard],
  },
  //#endregion country
  {
    path: "feedbacks",
    component: FeedbackComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "startpage",
    component: HomeComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "travelers",
    component: TravelerComponent,
    canActivate: [AuthorizationGuard],
  },
  //#region tripoffers
  {
    path: "tripoffers",
    component: TripofferComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "tripoffers/edit/:id",
    component: EditTripofferComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "tripoffer/view/:landId",
    component: LearnMoreComponent,
    canActivate: [AuthorizationGuard],
  },
  //#endregion tripoffers
  {
    path: "users",
    component: AdminComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "user-profile",
    component: UserProfileComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "verwaltung",
    component: DashboardComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "newsletter",
    component: NewsletterComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: "mailing-list",
    component: MailingListComponent,
    canActivate: [AuthorizationGuard],
  },
];
