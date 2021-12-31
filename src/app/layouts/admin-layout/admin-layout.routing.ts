import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { AdminComponent } from "../../pages/admins/admin.component";
import { BookingComponent } from "src/app/pages/booking/booking.component";
import { TravelerComponent } from "src/app/pages/traveler/traveler.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "verwaltung", component: DashboardComponent },
  { path: "users", component: AdminComponent },
  { path: "bookings", component: BookingComponent },
  { path: "travelers", component: TravelerComponent },
  { path: "user-profile", component: UserProfileComponent },
];
