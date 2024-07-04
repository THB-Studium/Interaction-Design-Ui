import { Component, OnInit } from "@angular/core";
import { Router, RouterLinkActive, RouterLink } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { TripOffer } from "src/app/models/tripOffer";
import { NgFor, NgIf } from "@angular/common";
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbCollapse } from "@ng-bootstrap/ng-bootstrap";
import {RoutingPaths} from '../../shared/const';

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
    icon: "ni ni-tv-2 text-black-50",
    class: "",
  },
  {
    path: "/users",
    title: "Benutzer",
    icon: "fa fa-users text-primary",
    class: "",
  },
  {
    path: "/user-profile",
    title: "Benutzerprofil",
    icon: "fas fa-id-card text-green",
    class: "",
  },
  {
    path: "/bookings",
    title: "Buchungen",
    icon: "fas fa-th-list text-info",
    class: "",
  },
  {
    path: "/feedbacks",
    title: "Feedbacks",
    icon: "far fa-comment-alt text-red",
    class: "",
  },
  {
    path: "/countries",
    title: "Länder",
    icon: "fas fa-globe text-green",
    class: "",
  },
  {
    path: "/tripoffers",
    title: "Reiseangebote",
    icon: "fas fa-plane-departure text-info",
    class: "",
  },
  {
    path: "/travelers",
    title: "Reisende",
    icon: "fas fa-users text-primary",
    class: "",
  }
];

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
    standalone: true,
    imports: [
        RouterLinkActive,
        RouterLink,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbCollapse,
        NgFor,
        NgIf,
    ],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  public currentOffers: RouteInfo[];

  constructor(
    private router: Router,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService
  ) {
    this.currentOffers = [];
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
    // Get default tripoffer
    this.getDefaultTripoffer();
  }

  private getDefaultTripoffer() {
    let offers: TripOffer[] = [];
    this.tripofferService.getAll().subscribe({
      next: (result) => offers = result,
      error: () => {
        this.toastrService.info('Wählen sie eine aus der Liste aus.');
        this.router.navigate([RoutingPaths.TRIP_OFFERS]);
      },
      complete: () => {
        this.currentOffers = [];
        // filter the current offers
        offers = offers.filter(x => x.landId !== null && new Date(x.endDatum) > new Date());
        offers.forEach(x => {
          const offer: RouteInfo = {
            class: 'dropdown-item',
            icon: `fa fa-plane-departure ${this.randomColor()}`,
            path: `tripoffer/view/${x.id}`,
            title: `${x.titel}`
          }
          // add to the list of offer
          this.currentOffers.push(offer);
        });
      }
    });
  }

  private randomColor(): string {
    const colors = ['text-info', 'text-primary', 'text-danger', 'text-success', 'text-black-50'];
    const idx = Math.floor(Math.random() * colors.length);
    return colors[idx];
  }

  protected readonly RoutingPaths = RoutingPaths;
}
