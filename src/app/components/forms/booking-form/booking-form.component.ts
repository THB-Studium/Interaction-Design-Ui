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

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";

import { Booking } from "src/app/models/booking";
import { TripOffer } from "src/app/models/tripOffer";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";
import { CountryService } from "src/app/services/country/country.service";
import { formatDate } from "@angular/common";
import { Traveler } from "src/app/models/traveler";
import { BookingClass } from "src/app/models/bookingClass";
import { TravelerService } from "src/app/services/traveler/traveler.service";
import { BookingClassService } from "src/app/services/booking-class/booking-class.service";
import { PaymentMethod } from "src/app/enums/paymentMethod";

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
    coTraveler: new FormControl("", []),
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

  public bookingclassFilteringCtrl: FormControl = new FormControl();

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
  // Defines paymentMethodArray
  paymentMethodArray: string[];
  // Defines dateError
  dateError: string;
  // Defines dateValid
  dateValid: boolean = false;
  // Defines defaultAirport
  defaultAirport: string;

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
      flugHafen: "",
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
    // get the list of all booking class
    this.getAllBookingClass();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
    // on tripoffer value changes, we read and save the attached airports
    this.bookingForm.get("tripoffer").valueChanges.subscribe((tripoffer) => {
      this.initAirports(tripoffer.id);
    });

    // On date value changes check whether it is valide or not.
    this.bookingForm.get("date").valueChanges.subscribe((date) => {
      const selectedDate =
        date !== ""
          ? formatDate(date, "yyyy-MM-dd", "en_US")
          : formatDate(null, "yyyy-MM-dd", "en_US");
      const now = formatDate(new Date(), "yyyy-MM-dd", "en_US");

      if (selectedDate < now) {
        this.dateError = "Die Eingabe bitte mal prüfen.";
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
            // booking is for type 
            const value: any = booking;
            this.currentBooking.id = value.id;
            this.defaultAirport = value.flugHafen ?? 'Berlin'; //todo
            this.currentBooking.datum = value.datum;
            this.currentBooking.handGepaeck = value.handGepaeck;
            this.currentBooking.koffer = value.koffer;
            this.currentBooking.zahlungMethod = value.zahlungMethod;

            console.log(value);
            let landId = null;
            // Get the tripoffer
            this.tripofferService.getOne(value.reiseAngebotId).subscribe({
              next: (offer) => {
                this.bookingForm.get("tripoffer").setValue(offer);
                this.currentBooking.reiseAngebotId = offer.id;
              },
              error: () =>
                this.toastrService.error(
                  "Die Reiseangebot Informationen konnten nicht geladen werden"
                ),
              complete: () => {
                // Get the traveler information
                this.travelerService.getOne(value.reiserId).subscribe({
                  next: (traveler) => {
                    this.currentBooking.reiser = traveler;
                    this.bookingForm.get("traveler").setValue(traveler);
                  },
                  error: () =>
                    this.toastrService.error(
                      "Die Reisende Informationen konnten nicht geladen werden"
                    ),
                  complete: () => {
                    // if cotraveler exists, than get his information
                    if (value.mitReiserId) {
                      this.travelerService.getOne(value.mitReiserId).subscribe({
                        next: (traveler) => {
                          this.currentBooking.mitReiser = traveler;
                          this.bookingForm.get("coTraveler").setValue(traveler);
                        },
                        error: () =>
                          this.toastrService.error(
                            "Die Mitreisende Informationen konnten nicht geladen werden"
                          ),
                      });
                    }
                    // Get the bookingclass information
                    const bcId =
                      value.buchungsKlasseId ??
                      "983e2be2-5915-44e8-a8aa-d1464de16954"; // Todo
                    this.bookingclassService.getOne(bcId).subscribe({
                      next: (bc) => {
                        this.bookingForm.get("bookingClass").setValue(bc);
                        this.currentBooking.buchungsklasseId = bc.id;
                      },
                      error: () =>
                        this.toastrService.error(
                          "Die Buchungsklasse Informationen konnten nicht geladen werden"
                        ),
                      complete: () => {
                        // init the form
                        this.setFormDefaultValue(this.currentBooking);
                      },
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
      var id = this.isAnAdd ? null :  this.currentBooking.id;
      this.currentBooking = {
        id: id,
        buchungsklasseId: this.bookingForm.get("bookingClass").value.id,
        flugHafen: this.bookingForm.get("airport").value,
        datum: this.bookingForm.get("date").value,
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
      error: () =>
        this.toastrService.error(
          "Die Reiseangebote konnten nicht geladen werden",
          "Fehler"
        ),
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
  private initAirports(tripOfferId: string) {
    let landId = null;
    let tripoffer: TripOffer = null;
    this.tripofferService.getOne(tripOfferId).subscribe({
      next: (_tripoffer) => {
        tripoffer = _tripoffer;
        landId = _tripoffer.landId ?? "3c70b1b2-e937-4af4-ad61-95f9c0c6d67c"; //todo: tripoffer.landId;
      },
      error: () =>
        this.toastrService.error(
          "Etwas ist schief gelaufen. Die Flughafen konnten nicht geladen werden",
          "Fehler"
        ),
      complete: () => {
        // get the list of airport
        if (landId) {
          this.countryService.getOne(landId).subscribe({
            next: (country) => (this.airportArray = country.flughafen),
            error: () =>
              this.toastrService.error(
                "Die  Flughafen konnten nicht geladet werden",
                "Fehler"
              ),
          });
        } else {
          if (!tripoffer.landId) {
            this.toastrService.error(
              "Das Angebot hat noch kein Ziel zugewiesen.",
              "Fehler"
            );
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
      error: () =>
        this.toastrService.error(
          "Die Liste von Reisende konnten nicht geladen werden",
          "Fehler"
        ),
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

  private getAllBookingClass() {
    this.bookingclassService.getAll().subscribe({
      next: (bc) => (this.bookingclass = bc),
      error: () =>
        this.toastrService.error(
          "Die Liste von Buchungenklassen konnten nicht geladen werden",
          "Fehler"
        ),
      complete: () => this.onBookingclassValueChanges(),
    });
  }

  private onBookingclassValueChanges() {
    this.bookingclassFilteringCtrl.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.bookingclass) {
            return [];
          }
          return this.bookingclass.filter(
            (x) => x.type.toLowerCase().indexOf(search) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe({
        next: (filteredBookingclass) => {
          this.searching = false;
          this.filteredBookingclass.next(filteredBookingclass);
        },
        error: () => (this.searching = false),
      });
  }
}
