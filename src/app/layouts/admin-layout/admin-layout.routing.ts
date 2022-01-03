import { Routes } from "@angular/router";

import { AuthorizationGuard } from "src/app/services/authorization/authorization.guard";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { AdminComponent } from "../../pages/admins/admin.component";
import { BookingComponent } from "src/app/pages/booking/booking.component";
import { TravelerComponent } from "src/app/pages/traveler/traveler.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "verwaltung", component: DashboardComponent, canActivate: [AuthorizationGuard] },
  { path: "users", component: AdminComponent, canActivate: [AuthorizationGuard] },
  { path: "bookings", component: BookingComponent, canActivate: [AuthorizationGuard] },
  { path: "travelers", component: TravelerComponent, canActivate: [AuthorizationGuard] },
  { path: "user-profile", component: UserProfileComponent, canActivate: [AuthorizationGuard] },
];
