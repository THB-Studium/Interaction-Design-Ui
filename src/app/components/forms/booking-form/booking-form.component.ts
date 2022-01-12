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
    /*traveler: new FormControl("", [Validators.required]),
    // cotraveler
    coTraveler: new FormControl("", []),
    // handLuggage
    handLuggage: new FormControl("", []),
    // suitcase
    suitcase: new FormControl("", []),
    // bookigclass
    bookingClass: new FormControl("", []),
    // paymentMethod
    paymentMethod: new FormControl("", []),*/
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

  constructor(
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService,
    private tripofferService: TripOfferService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllTripOffers();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
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
            this.currentBooking = booking;
            this.setFormDefaultValue(this.currentBooking);
            this.currentBookingId = this.currentBooking.id;
            this.currentTripofferId = this.currentBooking.reiseAngebotId;
          },
          error: () => {
            this.toastrService.error(
              `Die daten konnte nicht geladen werden.`,
              "Fehler"
            );
          },
        })
        .unsubscribe();
    }
  }

  private setFormDefaultValue(booking: Booking): void {
    this.bookingForm.setValue({
      buchungsklasseId: booking.buchungsklasseId,
      flugHafen: booking.flugHafen,
      datum: booking.datum,
      reiser: booking.reiser,
      mitReiser: booking.mitReiser,
      handGepaeck: booking.handGepaeck,
      koffer: booking.koffer,
      zahlungsMethode: booking.zahlungsMethode,
      reiseAngebotId: booking.reiseAngebotId,
    });
  }

  private onFormValuesChanged(): void {
    this.bookingForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentBookingId;
        }
        console.log(this.bookingForm.get("tripoffer").value.id)
        // init the list of airport
        if (this.bookingForm.get("tripoffer").value.id) {
          this.initAirports(this.bookingForm.get("tripoffer").value.id);
        }
        console.log(this.airportArray)
        return
        this.currentBooking = {
          id: id,
          buchungsklasseId: this.bookingForm.get("bookingClass").value,
          flugHafen: this.bookingForm.get("airport").value,
          datum: this.bookingForm.get("date").value,
          reiser: this.bookingForm.get("traveller").value,
          mitReiser: this.bookingForm.get("coTraveler").value,
          handGepaeck: this.bookingForm.get("handLuggage").value,
          koffer: this.bookingForm.get("suitcase").value,
          zahlungsMethode: this.bookingForm.get("paymentMethod").value,
          reiseAngebotId: this.bookingForm.get("tripoffer").value.id,
        };
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
      this.bookingForm.get("traveller").valid &&
      this.bookingForm.get("coTraveler").valid &&
      this.bookingForm.get("handLuggage").valid &&
      this.bookingForm.get("suitcase").valid &&
      this.bookingForm.get("paymentMethod").valid &&
      this.bookingForm.get("tripoffer").valid
    ) {
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
      complete: () => this.onTripOfferValueChanges()
    });
  }

  /**On country select */
  private onTripOfferValueChanges() {
    this.tripofferFilteringCtrl.valueChanges.pipe(
      filter((search) => !!search),
      tap(() => (this.searching = true)),
      takeUntil(this._onDestroy),
      debounceTime(200),
      map(search => {
        if (!this.tripoffers) {
          return [];
        }
        return this.tripoffers.filter(x => x.titel.toLowerCase().indexOf(search) > -1);
      }),
      delay(500),
      takeUntil(this._onDestroy)
    ).subscribe({
      next: filteredTripoffer => {
        this.searching = false;
        this.filteredTripoffers.next(filteredTripoffer);
      },
      error: () => this.searching = false
    });
  }

  /**Initializes the list of airports base of the selected coutry */
  private initAirports(tripOfferId: string) {
    let landId = null;
    let tripoffer: TripOffer = null;
    this.tripofferService.getOne(tripOfferId).subscribe({
      next: (_tripoffer) => {
        tripoffer = _tripoffer;
        landId = '3c70b1b2-e937-4af4-ad61-95f9c0c6d67c'; //todo: tripoffer.landId;
      },
      error: () => this.toastrService.error('Die Dazu gehörigen Flughafen konnten nicht geladet werden', 'Fehler'),
      complete: () => {
        console.log(landId)
        // get the list of airport
        if (landId) {
          this.countryService.getOne(landId).subscribe({
            next: (country) => this.airportArray = country.flughafen,
            error: () => this.toastrService.error('Die Dazu gehörigen Flughafen konnten nicht geladet werden', 'Fehler'),
          });
        } else {
          if (!tripoffer.landId) {
            this.toastrService.error('Das Angebot hat noch kein Ziel zugewiesen.', 'Fehler');
          } else {
            this.toastrService.error('Etwas ist schief gelaufen.', 'Fehler');
          }
        }
      }
    });
  }
}
