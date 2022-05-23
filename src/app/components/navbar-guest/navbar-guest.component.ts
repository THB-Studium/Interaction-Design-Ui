import {Component, OnInit} from "@angular/core";
import { formatDate } from "@angular/common";
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

  public isCollapsed = true;
  loading = false;

  // Defines currentOffers
  currentOffers: TripOffer[];
  // Defines hasOffers
  hasOffers: boolean;

  constructor(
    private router: Router,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {
    this.currentOffers = [];
    this.hasOffers = false;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    this.getOfferList();
  }

  getOfferList() {
    this.tripofferService.getAll().subscribe({
      next: (result) => {
        const today = formatDate(new Date(), "yyyy-MM-dd", "en_US");
        this.currentOffers = result.filter(
          (x) => x.endDatum > today && x.landId != null
        );
        this.hasOffers = this.currentOffers.length > 0;
      },
      error: () => {
        this.toastrService.info(
          "Die Liste von Reiseangebote konnten nicht geladen werden."
        );
      },
    });
  }

  startReservationProcess() {
    const dialodForm = this.dialog.open(CurrentOffersListFormComponent, {
      disableClose: true,
      autoFocus: true,
    });
    dialodForm.componentInstance.currentOffers = this.currentOffers;
  }
}
