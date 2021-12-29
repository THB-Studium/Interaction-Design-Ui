import { Routes } from "@angular/router";

import { AdminComponent } from "../../pages/admins/admin.component";
import { BookingComponent } from "src/app/pages/booking/booking.component";
import { CountryComponent } from "src/app/pages/country/country.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { EditCountryComponent } from "src/app/pages/edit-country/edit-country.component";
import { TravelerComponent } from "src/app/pages/traveler/traveler.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "verwaltung", component: DashboardComponent },
  { path: "admins", component: AdminComponent },
  { path: "bookings", component: BookingComponent },
  //#region country
  { path: "countries", component: CountryComponent },
  { path: "countries/edit/:id", component: EditCountryComponent },
  //#endregion country
  { path: "travelers", component: TravelerComponent },
  { path: "user-profile", component: UserProfileComponent },
];
