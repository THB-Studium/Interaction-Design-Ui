import {Component, OnInit} from "@angular/core";
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

  constructor(location: Location, private router: Router) {
    // Get the current page
    this.location = location;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
