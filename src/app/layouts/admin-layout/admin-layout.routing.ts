import { Routes } from "@angular/router";

import { AuthorizationGuard } from "src/app/services/authorization/authorization.guard";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { AdminComponent } from "../../pages/admins/admin.component";
import { BookingComponent } from "src/app/pages/booking/booking.component";
import { EditTripofferComponent } from "src/app/pages/edit-tripoffer/edit-tripoffer.component";
import { CountryComponent } from "src/app/pages/country/country.component";
import { EditCountryComponent } from "src/app/pages/edit-country/edit-country.component";
import { TravelerComponent } from "src/app/pages/traveler/traveler.component";
import { TripofferComponent } from "src/app/pages/tripoffer/tripoffer.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "verwaltung", component: DashboardComponent, canActivate: [AuthorizationGuard] },
  { path: "users", component: AdminComponent, canActivate: [AuthorizationGuard] },
  { path: "bookings", component: BookingComponent, canActivate: [AuthorizationGuard] },
  { path: "travelers", component: TravelerComponent, canActivate: [AuthorizationGuard] },
  { path: "user-profile", component: UserProfileComponent, canActivate: [AuthorizationGuard] },
  { path: "tripoffers", component: TripofferComponent, canActivate: [AuthorizationGuard] },
  { path: "tripoffers/edit/:id", component: EditTripofferComponent, canActivate: [AuthorizationGuard] },
  //#region country
  { path: "countries", component: CountryComponent, canActivate: [AuthorizationGuard] },
  { path: "countries/edit/:id", component: EditCountryComponent, canActivate: [AuthorizationGuard] },
  //#endregion country
];
