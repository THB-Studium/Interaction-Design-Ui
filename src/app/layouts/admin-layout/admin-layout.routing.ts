import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { AdminComponent } from "../../pages/admins/admin.component";
import { BookingComponent } from "src/app/pages/booking/booking.component";
import { TravelerComponent } from "src/app/pages/traveler/traveler.component";
import { TripofferComponent } from "src/app/pages/tripoffer/tripoffer.component";
import { TripofferFormComponent } from "src/app/components/forms/tripoffer-form/tripoffer-form.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "verwaltung", component: DashboardComponent },
  { path: "admins", component: AdminComponent },
  { path: "bookings", component: BookingComponent },
  { path: "travelers", component: TravelerComponent },
  { path: "tripoffers", component: TripofferComponent },
  { path: "tripoffers/edit/:id", component: TripofferFormComponent },
  { path: "user-profile", component: UserProfileComponent },
];
