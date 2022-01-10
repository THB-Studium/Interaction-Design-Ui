import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/verwaltung",
    title: "Dashboard",
    icon: "ni-tv-2 text-primary",
    class: "",
  },
  {
    path: "/users",
    title: "Benutzer",
    icon: "fa fa-users text-black-50",
    class: "",
  },
  {
    path: "/bookings",
    title: "Buchungen",
    icon: "fas fa-th-list text-info",
    class: "",
  },
  {
    path: "/tripoffers",
    title: "Reiseangebote",
    icon: "fas fa-plane-departure text-black",
    class: "",
  },
  {
    path: "/countries",
    title: "Länder",
    icon: "fas fa-globe text-green",
    class: ""
  },
  {
    path: "/travelers",
    title: "Reisende",
    icon: "fas fa-users text-primary",
    class: "",
  },
  {
    path: "/user-profile",
    title: "Benutzerprofil",
    icon: "fas fa-id-card text-green",
    class: "",
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
  }
}
