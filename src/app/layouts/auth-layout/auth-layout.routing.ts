import { Routes } from "@angular/router";

import { AboutusComponent } from "src/app/pages/aboutus/aboutus.component";
import { HomeComponent } from "src/app/pages/home/home.component";
import { LogoutComponent } from "src/app/pages/logout/logout.component";
import { LoginComponent } from "../../pages/login/login.component";

export const AuthLayoutRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "aboutus", component: AboutusComponent },
];
