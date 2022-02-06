import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { CountryService } from "src/app/services/country/country.service";
import { BookingFormComponent } from "../booking-form/booking-form.component";

import { TripOffer } from "src/app/models/tripOffer";

@Component({
  selector: "app-current-offers-list-form",
  templateUrl: "./current-offers-list-form.component.html",
  styleUrls: ["./current-offers-list-form.component.css"],
})
export class CurrentOffersListFormComponent implements OnInit {
  // Defines selectedOffer
  public selectedOffer: FormControl;
  // Defines currentOffers
  currentOffers: TripOffer[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private countryService: CountryService
  ) {
    this.selectedOffer = new FormControl();
    this.currentOffers = [];
  }

  ngOnInit(): void {}

  startBookingProcess() {
    this.router.navigate(['learn-more', this.selectedOffer.value.id]);
    let country = null;
    this.countryService.getOne(this.selectedOffer.value.landId).subscribe({
      next: (result) => country = result,
      complete: () => {
        const dialog = this.dialog.open(BookingFormComponent, {
          width: '750px',
          height: '800px',
          disableClose : true,
          autoFocus : true
        });
        // Set needed values
        dialog.componentInstance.land = country;
        dialog.componentInstance.currentTripOffer = this.selectedOffer.value;
      }
    });
  }
}
