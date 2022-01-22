import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import {
  debounceTime,
  delay,
  tap,
  filter,
  map,
  takeUntil,
} from "rxjs/operators";
import { formatDate } from "@angular/common";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";
import { TravelerService } from "src/app/services/traveler/traveler.service";
import { BookingClassService } from "src/app/services/booking-class/booking-class.service";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";
import { CountryService } from "src/app/services/country/country.service";

import { Booking } from "src/app/models/booking";
import { TripOffer } from "src/app/models/tripOffer";
import { Traveler } from "src/app/models/traveler";
import { BookingClass } from "src/app/models/bookingClass";
import { PaymentMethod } from "src/app/enums/paymentMethod";
import { Calendar } from "src/app/variables/calendar";

@Component({
  selector: "app-booking-form",
  templateUrl: "./booking-form.component.html",
  styleUrls: ["./booking-form.component.css"],
})
export class BookingFormComponent implements OnInit, AfterViewInit, OnDestroy {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines bookingForm
  bookingForm = new FormGroup({
    // tripoffer
    tripoffer: new FormControl("", [Validators.required]),
    // airport
    airport: new FormControl("", [Validators.required]),
    // date
    date: new FormControl("", [Validators.required]),
    // traveler
    traveler: new FormControl("", [Validators.required]),
    // cotraveler
    coTraveler: new FormControl(null, []),
    // handLuggage
    handLuggage: new FormControl("", []),
    // suitcase
    suitcase: new FormControl("", []),
    // bookigclass
    bookingClass: new FormControl("", [Validators.required]),
    // paymentMethod
    paymentMethod: new FormControl("", [Validators.required]),
  });

  /** list of tripoffers */
  protected tripoffers: TripOffer[];

  public tripofferFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searching = false;

  /** list of banks filtered after simulating server side search */
  public filteredTripoffers: ReplaySubject<TripOffer[]> = new ReplaySubject<
    TripOffer[]
  >(1);

  /** list of travelers */
  protected travelers: Traveler[];

  public travelerFilteringCtrl: FormControl = new FormControl();

  /** list of banks filtered after simulating server side search */
  public filteredTravelers: ReplaySubject<Traveler[]> = new ReplaySubject<
    Traveler[]
  >(1);

  /** list of bookingclass */
  protected bookingclass: BookingClass[];

  /** list of banks filtered after simulating server side search */
  public filteredBookingclass: ReplaySubject<BookingClass[]> =
    new ReplaySubject<BookingClass[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  // Defines currentBooking.
  currentBooking: Booking;
  // Defines currentBookingId.
  currentBookingId: string = "";
  // Defines currentTripofferId
  currentTripofferId = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAnAdd: boolean = true;
  // defines airportArray
  airportArray: string[];
  // Defines bookingclassArray
  bookingclassArray: BookingClass[];
  // Defines paymentMethodArray
  paymentMethodArray: string[];
  // Defines dateError
  dateError: string;
  // Defines dateValid
  dateValid: boolean = false;
  // Defines defaultAirport
  defaultAirport: string;
  // Defines selectedDate
  selectedDate: any;

  constructor(
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService,
    private tripofferService: TripOfferService,
    private countryService: CountryService,
    private travelerService: TravelerService,
    private bookingclassService: BookingClassService
  ) {
    this.currentBooking = {
      buchungsklasseId: "",
      datum: "",
      flughafen: "",
      handGepaeck: "",
      id: "",
      koffer: "",
      mitReiser: null,
      reiseAngebotId: "",
      reiser: null,
      zahlungMethod: null,
    };
    this.dateError = "";
    this.paymentMethodArray = [
      PaymentMethod.EINMAL,
      PaymentMethod.GUTHABEN,
      PaymentMethod.GUTSCHEIN,
      PaymentMethod.RATENZAHLUNG,
      PaymentMethod.ANZAHLUNG_150,
    ];
  }

  ngOnInit(): void {
    this.initForm();
    // get the list of all offers
    this.getAllTripOffers();
    // get the list of all travelers
    this.getAllCustomers();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
    // on tripoffer value changes, we read and save the attached airports
    this.bookingForm.get("tripoffer").valueChanges.subscribe((tripoffer) => {
      this.initAttachedInformation(tripoffer.id);
    });

    // On date value changes check whether it is valide or not.
    this.bookingForm.get("date").valueChanges.subscribe((date) => {
      this.selectedDate =
        date !== ""
          ? formatDate(date, "yyyy-MM-dd", "en_US")
          : formatDate(null, "yyyy-MM-dd", "en_US");
      const now = formatDate(new Date(), "yyyy-MM-dd", "en_US");

      if (this.selectedDate < now) {
        this.dateError = "Die Eingabe bitte mal prüfen.";
        this.dateValid = false;
      } else {
        this.dateError = "";
        this.dateValid = true;
      }
    });

    this.bookingForm
      .get("tripoffer")
      .valueChanges.subscribe((tripoffer: TripOffer) => {
        const startdate = formatDate(
          tripoffer.startDatum,
          "yyyy-MM-dd",
          "en_US"
        );
        const enddate = formatDate(tripoffer.endDatum, "yyyy-MM-dd", "en_US");
        const deadlineDate = formatDate(
          tripoffer.anmeldungsFrist,
          "yyyy-MM-dd",
          "en_US"
        );

        if (this.selectedDate > deadlineDate && this.selectedDate < enddate) {
          this.dateError = `Eingabe ist falsch. Für dieses Angebot ist die frist ${this.convertDateToString(
            deadlineDate
          )} abgelaufen.`;
          this.dateValid = false;
        }
        if (this.selectedDate > enddate) {
          this.dateError = `Eingabe ist falsch. Das Angebot ist von ${this.convertDateToString(
            startdate
          )} bis zum ${this.convertDateToString(enddate)} gültig.`;
          this.dateValid = false;
        } else {
          this.dateError = "";
          this.dateValid = true;
        }
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private initForm(): void {
    this.isAnAdd = this.sharedDataService.isAddBtnClicked;
    // If it is not an add
    if (!this.isAnAdd) {
      this.sharedDataService.currentBooking
        .subscribe({
          next: (booking) => {
            const value: any = booking;
            this.currentBooking.id = value.id;
            this.defaultAirport = value.flughafen;
            this.currentBooking.datum = value.datum;
            this.currentBooking.handGepaeck = value.handGepaeck;
            this.currentBooking.koffer = value.koffer;
            this.currentBooking.zahlungMethod = value.zahlungMethod;

            // Get the tripoffer
            this.tripofferService.getOne(value.reiseAngebotId).subscribe({
              next: (offer) => {
                this.bookingForm.get("tripoffer").setValue(offer);
                this.currentBooking.reiseAngebotId = offer.id;
                // set booking class list
                this.bookingclassArray = offer.buchungsklassenReadListTO;
              },
              error: () => {
                this.toastrService.error(
                  "Die Reiseangebot Informationen konnten nicht geladen werden"
                );
              },
              complete: () => {
                // Get the traveler information
                this.travelerService.getOne(value.reiserId).subscribe({
                  next: (traveler) => {
                    this.currentBooking.reiser = traveler;
                    this.bookingForm.get("traveler").setValue(traveler);
                  },
                  error: () => {
                    this.toastrService.error(
                      "Die Reisende Informationen konnten nicht geladen werden"
                    );
                  },
                  complete: () => {
                    // if cotraveler exists, than get his information
                    if (value.mitReiserId) {
                      this.travelerService.getOne(value.mitReiserId).subscribe({
                        next: (traveler) => {
                          this.currentBooking.mitReiser = traveler;
                          this.bookingForm.get("coTraveler").setValue(traveler);
                        },
                        error: () => {
                          this.toastrService.error(
                            "Die Mitreisende Informationen konnten nicht geladen werden"
                          );
                        },
                      });
                    }
                    // Get the bookingclass information
                    const bcId = value.buchungsklasseId;
                    this.bookingclassService.getOne(bcId).subscribe({
                      next: (bc) => {
                        const idx = this.bookingclassArray.findIndex(x => x.id === bc.id);
                        this.bookingForm.get("bookingClass").setValue(this.bookingclassArray[idx]);
                        //this.bookingclassArray.splice(idx, 1);
                        // set the value of the current booking class in current booking 
                        this.currentBooking.buchungsklasseId = bc.id;
                      },
                      error: () => {
                        this.toastrService.error(
                          "Die Buchungsklasse Informationen konnten nicht geladen werden"
                        );
                      },
                      complete: () =>
                        this.setFormDefaultValue(this.currentBooking),
                    });
                  },
                });
              },
            });
          },
          error: () => {
            this.toastrService.error(
              "Die daten konnte nicht geladen werden.",
              "Fehler"
            );
          },
        })
        .unsubscribe();
    } else {
      this.selectedDate = formatDate(new Date(), "yyyy-MM-dd", "en_US");
      this.dateValid = true;
      this.bookingForm.setValue({
        date: this.selectedDate,
        tripoffer: null,
        airport: "",
        bookingClass: null,
        traveler: null,
        coTraveler: null,
        handLuggage: "",
        suitcase: "",
        paymentMethod: "",
      });
    }
  }

  private setFormDefaultValue(booking: Booking): void {
    this.bookingForm.setValue({
      date: booking.datum,
      tripoffer: this.bookingForm.get("tripoffer").value,
      airport: this.defaultAirport,
      bookingClass: this.bookingForm.get("bookingClass").value,
      traveler: this.bookingForm.get("traveler").value,
      coTraveler: this.bookingForm.get("coTraveler").value,
      handLuggage: booking.handGepaeck,
      suitcase: booking.koffer,
      paymentMethod: booking.zahlungMethod,
    });
  }

  private onFormValuesChanged(): void {
    this.bookingForm.valueChanges.subscribe({
      next: () => {
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.bookingForm.get("bookingClass").valid &&
      this.bookingForm.get("airport").valid &&
      this.bookingForm.get("date").valid &&
      this.dateValid &&
      this.bookingForm.get("traveler").valid &&
      this.bookingForm.get("coTraveler").valid &&
      this.bookingForm.get("handLuggage").valid &&
      this.bookingForm.get("suitcase").valid &&
      this.bookingForm.get("paymentMethod").valid &&
      this.bookingForm.get("tripoffer").valid
    ) {
      var id = this.isAnAdd ? null : this.currentBooking.id;

      this.currentBooking = {
        id: id,
        buchungsklasseId: this.bookingForm.get("bookingClass").value.id,
        flughafen: this.bookingForm.get("airport").value,
        datum: this.selectedDate,
        reiser: this.bookingForm.get("traveler").value,
        mitReiser: this.bookingForm.get("coTraveler").value,
        handGepaeck: this.bookingForm.get("handLuggage").value,
        koffer: this.bookingForm.get("suitcase").value,
        zahlungMethod: this.bookingForm.get("paymentMethod").value,
        reiseAngebotId: this.bookingForm.get("tripoffer").value.id,
      };

      this.sharedDataService.changeCurrentBooking(this.currentBooking);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }

  private getAllTripOffers() {
    this.tripofferService.getAll().subscribe({
      next: (trip) => (this.tripoffers = trip),
      error: () => {
        this.toastrService.error(
          "Die Reiseangebote konnten nicht geladen werden",
          "Fehler"
        );
      },
      complete: () => this.onTripOfferValueChanges(),
    });
  }

  /**On country select */
  private onTripOfferValueChanges() {
    this.tripofferFilteringCtrl.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.tripoffers) {
            return [];
          }
          return this.tripoffers.filter(
            (x) => x.titel.toLowerCase().indexOf(search) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe({
        next: (filteredTripoffer) => {
          this.searching = false;
          this.filteredTripoffers.next(filteredTripoffer);
        },
        error: () => (this.searching = false),
      });
  }

  /**Initializes the list of airports base of the selected coutry */
  private initAttachedInformation(tripOfferId: string) {
    let landId = null;
    let tripoffer: TripOffer = null;
    this.tripofferService.getOne(tripOfferId).subscribe({
      next: (_tripoffer) => {
        tripoffer = _tripoffer;
        landId = _tripoffer.landId;
        this.bookingclassArray = tripoffer.buchungsklassenReadListTO;
      },
      error: () => {
        this.toastrService.error(
          "Etwas ist schief gelaufen. Die Flughafen konnten nicht geladen werden",
          "Fehler"
        );
      },
      complete: () => {
        // get the list of airport
        if (landId) {
          this.countryService.getOne(landId).subscribe({
            next: (country) => (this.airportArray = country.flughafen),
            error: () => {
              this.toastrService.error(
                "Die  Flughafen konnten nicht geladet werden",
                "Fehler"
              );
            },
          });
        } else {
          if (!tripoffer.landId) {
            this.toastrService.error(
              "Das Angebot hat noch kein Ziel zugewiesen.",
              "Fehler"
            );
            this.airportArray = [];
            this.notifyFormIsValid.emit(false);
          } else {
            this.toastrService.error("Etwas ist schief gelaufen.", "Fehler");
          }
        }
      },
    });
  }

  private getAllCustomers() {
    this.travelerService.getAll().subscribe({
      next: (travelers) => (this.travelers = travelers),
      error: () => {
        this.toastrService.error(
          "Die Liste von Reisende konnten nicht geladen werden",
          "Fehler"
        );
      },
      complete: () => this.onTravelerValueChanges(),
    });
  }

  private onTravelerValueChanges() {
    this.travelerFilteringCtrl.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.travelers) {
            return [];
          }
          return this.travelers.filter(
            (x) => x.email.toLowerCase().indexOf(search) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe({
        next: (filteredTraveler) => {
          this.searching = false;
          this.filteredTravelers.next(filteredTraveler);
        },
        error: () => (this.searching = false),
      });
  }

  getBookingclassArray(bc:BookingClass[]) {
    return bc?.filter(x => x.id !== this.bookingForm.get('bookingClass').value.id);
  }

  private convertDateToString(date: string) {
    if (date && date.includes("-")) {
      const day = parseInt(date.split("-")[2]);
      const month = parseInt(date.split("-")[1]);
      const year = parseInt(date.split("-")[0]);
      return `${day} ${Calendar.months[month - 1]} ${year}`;
    }
    return "";
  }
}
