import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { SharedDataService } from "../../services/sharedData/shared-data.service";

@Component({
  selector: "app-auth-layout",
  templateUrl: "./auth-layout.component.html",
  styleUrls: ["./auth-layout.component.scss"],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  headerBgColor: string;
  footerBgColor: string;
  isCollapsed = true;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService
  ) {
    this.getCurrentPageComponentsBackgroundColors();
  }

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-white");

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-primary");
  }

  getCurrentPageComponentsBackgroundColors() {
    this.sharedDataService.currentBackgroundColors.subscribe((value) => {
      this.headerBgColor = value.header;
      this.footerBgColor = value.bodyAndFooter;
    });
  }
}
