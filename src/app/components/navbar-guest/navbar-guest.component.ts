import {Component, OnInit} from "@angular/core";
import { formatDate, Location } from "@angular/common";
import { Router } from "@angular/router";
import { CurrentOffersListFormComponent } from "../forms/current-offers-list-form/current-offers-list-form.component";
import { MatDialog } from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { TripOffer } from "src/app/models/tripOffer";

@Component({
  selector: "app-navbar-guest",
  templateUrl: "./navbar-guest.component.html",
  styleUrls: ["./navbar-guest.component.css"],
})
export class NavbarGuestComponent implements OnInit {

  public listTitles: any[];
  public location: Location;

  public isCollapsed = true;
  loading = false;

  // Defines currentOffers
  currentOffers: TripOffer[];

  constructor(
    location: Location,
    private router: Router,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {
    // Get the current page
    this.location = location;
    this.currentOffers = [];
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  startReservationProcess() {
    // display loader
    this.loading = true;
    // Get the list of the current offers
    this.tripofferService.getAll().subscribe({
      next: (result: TripOffer[]) => {
        // only current and valid offers are needed
        const today = formatDate(new Date(), "yyyy-MM-dd", "en_US");
        this.currentOffers = result.filter(
          (x) => x.endDatum > today && x.landId != null
        );
      },
      error: () => {
        this.toastrService.info(
          "Die Liste von Reiseangebote konnten nicht geladen werden."
        );
        // hide the loader on error
        this.loading = false;
      },
      complete: () => {
        const dialodForm = this.dialog.open(CurrentOffersListFormComponent, {
          disableClose: true,
          autoFocus: true,
        });
        dialodForm.componentInstance.currentOffers = this.currentOffers;
        // hide the loader on modal open
        this.loading = false;
      },
    });
  }
}
