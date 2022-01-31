import {Component, Input, OnInit} from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-navbar-guest",
  templateUrl: "./navbar-guest.component.html",
  styleUrls: ["./navbar-guest.component.css"],
})
export class NavbarGuestComponent implements OnInit {
  @Input() headerBgColor: any

  public listTitles: any[];
  public location: Location;

  public isCollapsed = true;

  public homepageSrc: BehaviorSubject<boolean>;

  public isHomepage: Observable<boolean>;

  constructor(location: Location, private router: Router) {
    // Get the current page
    this.location = location;

    // Default homepage
    /*this.homepageSrc.next(true);
    this.isHomepage = this.homepageSrc.asObservable();*/
  }

  ngOnInit() {
    //this.getCurrentPage();

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  private getCurrentPage() {
    const url = this.location.prepareExternalUrl(this.location.path());
    if (url.charAt(0) === "#") {
      const currentPage = url.slice(1);
      if (currentPage.toLowerCase().includes('home')) {
        this.homepageSrc.next(true);
      }
    } else {
      this.homepageSrc.next(false);
    }
  }

  /**Change navbar backgroung on scroll */
  /*@HostListener("window:scroll", ["$event"])
  onWindowScroll(e: any) {
    if (this.title.includes("home")) {
      const element = document.querySelector(".navbar");
      window.pageYOffset > element.clientHeight
        ? element.classList.add("bg-auth")
        : element.classList.remove("bg-auth");
    }
  }*/
}
