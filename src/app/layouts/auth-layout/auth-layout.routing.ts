import { Routes } from "@angular/router";

import { LogoutComponent } from "src/app/pages/logout/logout.component";
import { LoginComponent } from "../../pages/login/login.component";
import { LearnMoreComponent } from "../../pages/learn-more/learn-more.component";
import { AboutusComponent } from "src/app/pages/aboutus/aboutus.component";
import { MyBookingComponent } from "src/app/pages/my-booking/my-booking.component";
import { ReservationComponent } from "src/app/pages/reservation/reservation.component";

export const AuthLayoutRoutes: Routes = [
  { path: "learn-more/:landId", component: LearnMoreComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "aboutus", component: AboutusComponent },
  { path: "my-booking", component: MyBookingComponent },
  { path: "reservation/:tripofferId", component: ReservationComponent }
];
