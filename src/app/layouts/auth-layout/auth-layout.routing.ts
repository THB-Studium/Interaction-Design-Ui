import { Routes } from "@angular/router";

import { LogoutComponent } from "src/app/pages/logout/logout.component";
import { LoginComponent } from "../../pages/login/login.component";
import { LearnMoreComponent } from "../../pages/learn-more/learn-more.component";
import { AboutusComponent } from "src/app/pages/aboutus/aboutus.component";

export const AuthLayoutRoutes: Routes = [
  {
    path: "learn-more/:landId",
    title: 'Land',
    component: LearnMoreComponent
  },
  {
    path: "login",
    title: 'Login',
    component: LoginComponent
  },
  {
    path: "logout",
    title: 'Logout',
    component: LogoutComponent
  },
  {
    path: "aboutus",
    title: 'About Us',
    component: AboutusComponent
  },
];
