import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CurrentOffersListFormComponent } from "src/app/components/forms/current-offers-list-form/current-offers-list-form.component";

import { Slide } from "src/app/models/slide";
import { TripOffer } from "src/app/models/tripOffer";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";
import { SlideList } from "src/app/shared/datas/slideList";

@Component({
  selector: "app-home-layout",
  templateUrl: "./home-layout.component.html",
  styleUrls: ["./home-layout.component.css"],
})
export class HomeLayoutComponent implements OnInit {
  isCollapsed = true;
  slideList: Array<Slide> = [];
  // Defines currentOffers
  currentOffers: TripOffer[];
  loading = false;
  // Defines hasOffers
  hasOffers: boolean;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService
  ) {
    this.slideList = SlideList.data;
    this.currentOffers = [];
    this.hasOffers = false;
  }

  ngOnInit(): void {
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

  toSection() {
    const elem = document.querySelector("footer");
    elem.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
