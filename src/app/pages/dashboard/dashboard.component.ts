import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { BookingService } from "src/app/services/booking/booking.service";
import { CountryService } from "src/app/services/country/country.service";
import { FeedbackService } from "src/app/services/feedback/feedback.service";
import { ToastrService } from "ngx-toastr";
import { TravelerService } from "src/app/services/traveler/traveler.service";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { Booking } from "src/app/models/booking";
import { Country } from "src/app/models/country";
import { TripOffer } from "src/app/models/tripOffer";

import { Calendar } from "src/app/variables/calendar";
import { formatDate, NgFor, NgIf } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { SpinnerComponent } from "../../components/spinner/spinner.component";
import {RoutingPaths} from '../../shared/const';

interface CurrentOffer {
  name: string;
  destination: string;
  interestAmount: number;
  rate: number;
  totalplace: number;
  freeplace: number;
  reservation: number;
}
@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        SpinnerComponent,
        RouterLink,
        MatProgressBarModule,
    ],
})
export class DashboardComponent implements OnInit {
  public statistics = [
    {
      title: "Reiseangebote",
      total: 0,
      badge_bg: "bg-gradient-blue",
      text: "Seit dem ..",
      link: "/tripoffers",
    },
    {
      title: "Buchungen",
      total: 0,
      badge_bg: "bg-gradient-info",
      text: "Seit dem ...",
      link: "/bookings",
    },
    {
      title: "Reisende",
      total: 0,
      badge_bg: "bg-gradient-primary",
      text: "bereits registriert.",
      link: "/travelers",
    },
    {
      title: "Feedbacks",
      total: 0,
      badge_bg: "bg-gradient-danger",
      text: "",
      link: "/feedbacks",
    },
  ];

  public tripofferList: TripOffer[];
  public currentTripoffers: CurrentOffer[];

  loading = true;

  constructor(
    private bookingService: BookingService,
    private countryService: CountryService,
    private feedbackService: FeedbackService,
    private router: Router,
    private toastrService: ToastrService,
    private travelerService: TravelerService,
    private tripofferService: TripOfferService
  ) {
    this.tripofferList = [];
    this.currentTripoffers = [];
  }

  ngOnInit() {
    // init tripoffer stats
    this.tripofferStatsInitialization();
    // init booking stats
    this.bookingStatsInitialization();
    // init traveler
    this.travelerStatsInitialization();
    // init feedba  k
    this.feedbackStatsInitialization();
  }

  private bookingStatsInitialization() {
    this.bookingService.getAll().subscribe({
      next: (result) => {
        if (result) {
          const idx = this.statistics.findIndex(
            (x) => x.title.toLowerCase() === "buchungen"
          );
          if (result.length > 0) {
            const minDate: Booking = result?.reduce((b1, b2) =>
              b1.datum <= b2.datum ? b1 : b2
            );
            // set the object
            this.statistics[idx].total = result?.length;
            this.statistics[idx].text = `Seit dem ${this.convertDateToString(
              minDate.datum
            )}`;
          }
        }
      },
      error: () => {
        this.toastrService.error(
          "Die Information über Buchungen konnte nicht geladen werden."
        );
      },
    });
  }

  private feedbackStatsInitialization() {
    this.feedbackService.getAll().subscribe({
      next: (result) => {
        const idx = this.statistics.findIndex(
          (x) => x.title.toLowerCase() === "feedbacks"
        );
        // set the object
        this.statistics[idx].total = result.length;
        this.statistics[idx].text =
          result.length < 1
            ? `${result.length} wartet auf Bestätigung.`
            : `${result.length} warten auf Bestätigung.`;
      },
      error: () => {
        this.toastrService.error(
          "Die Information über Feedbacks konnte nicht geladen werden."
        );
      },
    });
  }

  private travelerStatsInitialization() {
    this.travelerService.getAll().subscribe({
      next: (result) => {
        const idx = this.statistics.findIndex(
          (x) => x.title.toLowerCase() === "reisende"
        );
        // set the object
        this.statistics[idx].total = result.length;
      },
      error: () => {
        this.toastrService.error(
          "Die Information über Reisende konnte nicht geladen werden."
        );
      },
    });
  }

  private tripofferStatsInitialization() {
    this.tripofferService.getAll().subscribe({
      next: (result) => {
        // save all offers
        this.tripofferList = result;
        // find the offer stats into the array of the different stats.
        const idx = this.statistics.findIndex(
          (x) => x.title.toLowerCase() === "reiseangebote"
        );
        const minDate: TripOffer = result.reduce((t1, t2) =>
          t1.startDatum <= t2.startDatum ? t1 : t2
        );
        // set the object
        this.statistics[idx].total = result.length;
        this.statistics[idx].text = `Seit dem ${this.convertDateToString(
          minDate.startDatum
        )}`;
      },
      error: () => {
        this.toastrService.error(
          "Die Information über Reiseangebot konnte nicht geladen werden."
        );
      },
      complete: () => {
        // filter the offer to get only the current offer
        const today = formatDate(new Date(), "yyyy-MM-dd", "en_US");
        this.tripofferList = this.tripofferList.filter(
          (x) => x.endDatum > today && x.landId !== null
        );
        // amount of interested
        let interested = 0;
        this.tripofferList.forEach((x) => {
          interested += x.interessiert;
          // get the the offer by id
          let countryid = null;
          this.tripofferService.getOne(x.id).subscribe({
            next: (offer) => {
              countryid = offer.landId;
            },
            error: () => {
              this.toastrService.error(
                "Fehler beim Laden Reiseangebote Informationen"
              );
            },
            complete: () => {
              let country: Country = null;
              // get the country information
              if (countryid) {
                this.countryService.getOne(countryid).subscribe({
                  next: (result) => (country = result),
                  error: () => {
                    this.toastrService.error(
                      "Fehler beim Laden Reiseangebote Informationen"
                    );
                  },
                  complete: () => {
                    // add to the list of table
                    this.currentTripoffers.push({
                      name: x.titel,
                      destination: country.name,
                      interestAmount: x.interessiert < 0? 0 : x.interessiert,
                      rate:
                        interested > 0
                          ? Math.round(x.interessiert / interested) * 100
                          : 0,
                      freeplace: x.freiPlaetze,
                      totalplace: x.plaetze,
                      reservation:
                        x.plaetze > 0
                          ? Math.round(
                              ((x.plaetze - x.freiPlaetze) * 100) / x.plaetze
                            )
                          : 0,
                    });
                    // set loading flag to false
                    this.loading = false;
                  },
                });
              }
            },
          });
        });
      },
    });
  }

  /** Converts object of type date to string */
  convertDateToString(date: string) {
    if (date && date.includes("-")) {
      const day = parseInt(date.split("-")[2]);
      const month = parseInt(date.split("-")[1]);
      const year = parseInt(date.split("-")[0]);
      return `${day} ${Calendar.months[month - 1]} ${year}`;
    }
    return "";
  }

  navigateToUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  protected readonly RoutingPaths = RoutingPaths;
}
