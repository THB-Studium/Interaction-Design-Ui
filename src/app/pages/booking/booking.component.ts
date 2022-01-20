import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { OnCommit } from "src/app/interfaces/OnCommit";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
import { BookingService } from "src/app/services/booking/booking.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Booking } from "src/app/models/booking";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.css"],
})
export class BookingComponent implements OnInit, AfterViewInit, OnCommit {
  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = [
    "date",
    "traveler",
    "cotraveler",
    "airport",
    "bookingclass",
    "handluggage",
    "suitcase",
    "paymentmethod",
  ];
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
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();

  constructor(
    private bookingService: BookingService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    // Datasource initialization. This is needed to set paginator and items size
    this.dataSource = new MatTableDataSource([
      {
        id: "",
        buchungsklasseId: "",
        datum: "",
        flugHafen: "",
        handGepaeck: "",
        koffer: "",
        mitReiser: null,
        reiser: null,
        zahlungsMethode: "",
      },
    ]);

    // define the list of bookings
    this.bookingList = this.dataSource.data;

    // read bookings from the api
    this.getBookingList().then((admins) => {
      this.setDataSource(admins);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  beforeSave(): void {}

  beforeUpdate(): void {}

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
}
