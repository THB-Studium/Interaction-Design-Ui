import { Routes } from "@angular/router";

import { HomeComponent } from "src/app/pages/home/home.component";
import { LogoutComponent } from "src/app/pages/logout/logout.component";
import { LoginComponent } from "../../pages/login/login.component";
import { LearnMoreComponent } from "../../pages/learn-more/learn-more.component";

export const AuthLayoutRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "learn-more/:landId", component: LearnMoreComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
];
