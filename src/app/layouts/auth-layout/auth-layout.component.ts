import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { StandardColors } from "../../shared/datas/standard-colors";
import { SharedDataService } from "../../services/sharedData/shared-data.service";

@Component({
  selector: "app-auth-layout",
  templateUrl: "./auth-layout.component.html",
  styleUrls: ["./auth-layout.component.scss"],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  headerBgColor: any;
  footerBgColor: any;
  footerBtnColor: any;
  isCollapsed = true;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService
  ) {
    this.sharedDataService.currentBackgroundColor.subscribe((value) => {
      this.headerBgColor =
        value.header.background !== "" ? value.header : undefined;
      this.footerBgColor =
        value.bodyAndFooter.background !== ""
          ? value.bodyAndFooter
          : { background: StandardColors.data.blue };
      this.footerBtnColor = { color: this.footerBgColor.background };
    });
  }

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-priimary");
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

  test() {
    document.addEventListener("DOMContentLoaded", function () {
      let footerheight = document.querySelector("footer").offsetHeight;
      //document.querySelector("body").style.paddingBottom = footerheight;
    });
  }

}
