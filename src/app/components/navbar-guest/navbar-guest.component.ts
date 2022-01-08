import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar-guest",
  templateUrl: "./navbar-guest.component.html",
  styleUrls: ["./navbar-guest.component.css"],
})
export class NavbarGuestComponent implements OnInit {
  public listTitles: any[];
  public location: Location;

  public isCollapsed = true;

  public isAuth = false;

  constructor(location: Location, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    var title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === "#") {
      title = title.slice(1);
    }

    if (
      title.toLowerCase().includes("login") ||
      title.toLowerCase().includes("register") ||
      title.toLowerCase().includes("aboutus")
    ) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
