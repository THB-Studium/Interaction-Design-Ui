import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { formatDate } from "@angular/common";

import { BookingService } from "src/app/services/booking/booking.service";
import { BookingClassService } from "src/app/services/booking-class/booking-class.service";
import { CountryService } from "src/app/services/country/country.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";
import { TravelerService } from "src/app/services/traveler/traveler.service";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { Booking } from "src/app/models/booking";
import { BookingClass } from "src/app/models/bookingClass";
import { Country } from "src/app/models/country";
import { Calendar } from "src/app/variables/calendar";
import { Traveler } from "src/app/models/traveler";
import { TripOffer } from "src/app/models/tripOffer";

import { BookingFormComponent } from "src/app/components/forms/booking-form/booking-form.component";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.css"],
})
export class BookingComponent implements OnInit, AfterViewInit {
  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = ["date", "airport", "paymentmethod", "action"];
  // Defines selectedOffer
  public selectedOffer: FormControl;
  // Defines dataSource
  dataSource: MatTableDataSource<Booking>;
  // Defines bookingList
  bookingList: Booking[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines errors
  errors = {
    errorMessage: "",
  };
  // Defines currentBooking
  currentBooking: Booking;
  // Defines country
  country: Country;
  // Defines bookingclass
  bookingclass: BookingClass;
  // Defines traveler
  traveler: Traveler;
  //Defines coTraveler
  cotraveler: Traveler;
  // Defines tripoffer
  tripoffer: TripOffer;
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines isAdd
  isAdd = true;
  // Defines currentOffers
  currentOffers: TripOffer[];
  // Defines loading
  loading = true;

  constructor(
    private bookingService: BookingService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private bookingclassService: BookingClassService,
    private travelerService: TravelerService,
    private tripofferService: TripOfferService,
    private countryService: CountryService
  ) {
    this.dialogConfiguration();
    this.selectedOffer = new FormControl();
    this.currentOffers = [];
  }

  ngOnInit(): void {
    // Datasource initialization. This is needed to set paginator and items size
    this.dataSource = new MatTableDataSource([
      {
        id: "",
        buchungsklasseId: "",
        datum: "",
        flughafen: "",
        handGepaeck: "",
        koffer: "",
        mitReisender: null,
        reisender: null,
        zahlungMethod: null,
        reiseAngebotId: "",
      },
    ]);

    // define the list of bookings
    this.bookingList = this.dataSource.data;

    // read bookings from the api
    this.getBookingList().then((booking) => {
      this.setDataSource(booking);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Filters that get and display the entered value if found.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Sorts the by date descending
  sortByDate(bookingList: Booking[]): void {
    bookingList.sort((x, y) => {
      if (x.datum < y.datum) return 1;
      if (x.datum > y.datum) return -1;
      return 0;
    });
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Gets the booking list as promise
  private getBookingList(): Promise<Booking[]> {
    return new Promise((resolve) => {
      this.bookingService.getAll().subscribe({
        next: (bookings: Booking[]) => resolve(bookings),
        error: (error) => {
          this.handleError(error);
          this.toastrService.error(
            "Die Liste konnte nicht gelesen werden.",
            "Fehler"
          );
        },
      });
    });
  }

  // Populates rows into the table
  private setDataSource(bookings: Booking[]): void {
    this.bookingList = bookings;
    this.sortByDate(this.bookingList);
    this.dataSource.data = this.bookingList;
    // set loading flag
    this.loading = false;
  }

  addBookingDialog(dialogForm: any) {
    // The template need it to validate the input
    this.selectedOffer.setValue('');
    // Get the list of the current offers
    this.tripofferService.getAll().subscribe({
      next: (result: TripOffer[]) => {
        // only current and valid offers are needed
        const today = formatDate(new Date(), "yyyy-MM-dd", "en_US");
        this.currentOffers = result.filter(x => x.endDatum > today && x.landId != null);
      },
      error: () => {
        this.toastrService.error('Die Liste von Reiseangebote konnten nicht geladen werden.');
      },
      complete: () => this.dialog.open(dialogForm, this.dialogConfig)
    });
  }

  startBookingProcess() {
    // Get all information about the selected offer
    this.tripofferService.getOne(this.selectedOffer.value.id).subscribe({
      next: (result) => this.selectedOffer.setValue(result),
      complete: () => {
        // Get also the country information
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
        // Update the list
        this.getBookingList().then((booking) => {
          this.setDataSource(booking);
        });
      }
    });
  }

  /** Calls to save or update a booking */
  saveBooking() {
    this.sharedDataService.currentBooking
      .subscribe((booking) => {
        if (!booking.id) {
          this.bookingService.addOne(booking).subscribe({
            next: (savedValue) => {
              this.sharedDataService.changeCurrentBooking(savedValue);
              this.currentBooking = savedValue;
              this.bookingList.push(savedValue);
              this.sortByDate(this.bookingList);
              this.dataSource.data = this.bookingList;
            },
            error: () =>
              this.toastrService.error(
                "Die Buchung konnte nicht gespeichert werden",
                "Fehler"
              ),
            complete: () =>
              this.toastrService.success("Die Buchung wurde gespeichert"),
          });
        } else {
          console.log(booking)
          // for the update just id for traveler and cotraveler are needed
          const toUpdate = {
            id: booking.id,
            buchungsklasseId: booking.buchungsklasseId,
            datum: booking.datum,
            flughafen: booking.flughafen,
            handGepaeck: booking.handGepaeck,
            koffer: booking.koffer,
            mitReisenderId: booking.mitReisender ? booking.mitReisender.id : null,
            reisenderId: booking.reisender.id,
            zahlungMethod: booking.zahlungMethod,
            reiseAngebotId: booking.reiseAngebotId
          };

          this.bookingService.updateOne(toUpdate).subscribe({
            next: (savedValue) => {
              this.sharedDataService.changeCurrentBooking(savedValue);
              this.currentBooking = savedValue;
              const idx = this.bookingList.findIndex(
                (x) => x.id === savedValue.id
              );
              this.bookingList[idx] = savedValue;
              this.sortByDate(this.bookingList);
              this.dataSource.data = this.bookingList;
            },
            error: () => {
              this.toastrService.error(
                "Die Buchung konnte nicht gespeichert werden",
                "Fehler"
              );
            },
            complete: () =>
              this.toastrService.success("Die Buchung wurde gespeichert"),
          });
        }
      })
      .unsubscribe();
  }

  detailsDialog(booking, dialogForm: any) {
    this.currentBooking = booking;
    this.tripofferService.getOne(booking.reiseAngebotId).subscribe({
      next: (tripoffer) => (this.tripoffer = tripoffer),
      error: () =>
        this.toastrService.error("Etwas ist schief gelaufen.", "Fehler"),
      complete: () => {
        // Get country information
        const countryId = this.tripoffer.landId;
        this.countryService.getOne(countryId).subscribe({
          next: (country) => (this.country = country),
          error: () =>
            this.toastrService.error("Etwas ist schief gelaufen.", "Fehler"),
          complete: () => {
            // get the traveler information
            this.travelerService.getOne(booking.reisenderId).subscribe({
              next: (traveler) => (this.traveler = traveler),
              error: () => {
                this.toastrService.error(
                  "Etwas ist schief gelaufen.",
                  "Fehler"
                );
              },
              complete: () => {
                if (booking.mitReisenderId) {
                  this.travelerService.getOne(booking.mitReisenderId).subscribe({
                    next: (traveler) => (this.cotraveler = traveler),
                    error: () => {
                      this.toastrService.error(
                        "Etwas ist schief gelaufen.",
                        "Fehler"
                      );
                    },
                  });
                }
                // get the booking class
                let bookigclassId = booking.buchungsklasseId;
                this.bookingclassService.getOne(bookigclassId).subscribe({
                  next: (bc) => (this.bookingclass = bc),
                  error: () => {
                    this.toastrService.error(
                      "Etwas ist schief gelaufen.",
                      "Fehler"
                    );
                  },
                  complete: () =>
                    this.dialog.open(dialogForm, this.dialogConfig),
                });
              },
            });
          },
        });
      },
    });
  }

  editDialog(booking: Booking, dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = false;
    this.isAdd = false;
    this.currentBooking = booking;
    this.sharedDataService.changeCurrentBooking(booking);
    // Open the add admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteDialog(booking: Booking, dialogForm: any) {
    this.currentBooking = booking;
    // Open the add admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  /** Delete a Booking */
  deleteBooking() {
    this.bookingService.deleteOne(this.currentBooking.id).subscribe({
      next: () => {
        const idx = this.bookingList.findIndex(
          (x) => x.id === this.currentBooking.id
        );
        this.bookingList.splice(idx, 1);
        this.dataSource.data = this.bookingList;
      },
      error: () => {
        this.toastrService.error(
          "Die Buchung konnte nicht gelöscht werden.",
          "Fehler"
        );
      },
      complete: () =>
        this.toastrService.success("Die Buchung wurde erfolgreich gelöscht."),
    });
  }

  // On error
  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }

  // Sets the status of the form to not valid
  resetFormStatus() {
    this.valid = false;
  }

  isFormValid(event: any) {
    this.valid = event;
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

  getPhoneNumber(phone: string): string {
    return phone ? `${phone}` : "";
  }
}
