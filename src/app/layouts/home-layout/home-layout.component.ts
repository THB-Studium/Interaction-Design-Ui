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

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService
  ) {
    this.slideList = SlideList.data;
    this.currentOffers = [];
  }

  ngOnInit(): void {
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
          autoFocus: true
        });
        dialodForm.componentInstance.currentOffers = this.currentOffers;
        // hide the loader on modal open
        this.loading = false;
      },
    });
  }
  
  toSection() {
    const elem = document.querySelector("footer");
    console.log(elem);
    elem.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
