import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { formatDate } from "@angular/common";

import { CountryService } from "src/app/services/country/country.service";
import { ToastrService } from "ngx-toastr";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { Country } from "src/app/models/country";
import { TripOffer } from "src/app/models/tripOffer";

@Component({
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.css"],
})
export class ReservationComponent implements OnInit {
  public tripofferId: string;
  public currentTripOffer: TripOffer = {
    anmeldungsFrist: "",
    buchungsklassen: [],
    buchungsklassenReadListTO: [],
    endDatum: "",
    erwartungen: null,
    erwartungenReadListTO: null,
    freiPlaetze: 0,
    hinweise: "",
    id: "",
    interessiert: 0,
    landId: "",
    leistungen: [],
    mitreiseberechtigt: [],
    plaetze: 0,
    sonstigeHinweise: "",
    startbild: "",
    startDatum: "",
    titel: "",
  };

  public country: Country = {
    bodyFarbe: "",
    flughafen: [],
    headerFarbe: "",
    highlights: [],
    id: "",
    karte_bild: null,
    landInfo: [],
    name: "",
    unterkunft: [],
    unterkunft_text: "",
    realImage: "",
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService
  ) {
    // Get the tripoffer id from the param
    this.activatedRoute.paramMap.subscribe(
      (param) => (this.tripofferId = param.get("tripofferId"))
    );
  }

  ngOnInit(): void {
    this.getData();
  }

  // retrieve the tripoffer and the country information
  getData() {
    let isValid = true;
    this.tripofferService.getOne(this.tripofferId).subscribe({
      next: (result) => {
        this.currentTripOffer = result;
        // Check whether the tripoffer can still be reserved or not
        const today = formatDate(new Date(), "yyyy-MM-dd", "en_US");
        if (
          this.currentTripOffer.anmeldungsFrist < today ||
          this.currentTripOffer.freiPlaetze === 0
        ) {
          isValid = false;
          this.toastrService.info(
            "Diese Reise kann nicht mehr reserviert werden"
          );
          this.router.navigate(["learn-more", this.currentTripOffer.id]);
        }
      },
      error: (err) => console.error(err),
      complete: () => {
        if (isValid) {
          // retrieve the country information
          this.countryService.getOne(this.currentTripOffer.landId).subscribe({
            next: (result) => (this.country = result),
            error: (err) => console.error(err),
          });
        }
      },
    });
  }
}
