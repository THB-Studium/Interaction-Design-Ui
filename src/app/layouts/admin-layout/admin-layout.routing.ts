import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { AdminComponent } from "../../pages/admins/admin.component";
import { BookingComponent } from "src/app/pages/booking/booking.component";
import { TravelerComponent } from "src/app/pages/traveler/traveler.component";
import { CountriesListComponent } from "src/app/pages/country/countries-list/countries-list.component";
import { AddCountryComponent } from "src/app/pages/country/add-country/add-country.component";
import { EditCountryComponent } from "src/app/pages/country/edit-country/edit-country.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "verwaltung", component: DashboardComponent },
  { path: "admins", component: AdminComponent },
  { path: "bookings", component: BookingComponent },
  //#region country
  { path: "countries", component: CountriesListComponent },
  { path: "countries/add", component: AddCountryComponent },
  { path: "countries/edit/:id", component: EditCountryComponent },
  //#endregion country
  { path: "travelers", component: TravelerComponent },
  { path: "user-profile", component: UserProfileComponent },
];
