import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { BookingService } from 'src/app/services/booking/booking.service';
import { BookingClassService } from 'src/app/services/booking-class/booking-class.service';
import { TravelerService } from 'src/app/services/traveler/traveler.service';
import { ToastrService } from 'ngx-toastr';

import { Booking, BookingUpdate } from 'src/app/models/booking';
import { BookingClass } from 'src/app/models/bookingClass';
import { Traveler } from 'src/app/models/traveler';
import { BookingState } from 'src/app/enums/bookingState';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.css']
})
export class MyBookingComponent implements OnInit {

  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  public loading: boolean;
  public bookingNb: string;
  public tripoffer;
  public bookingclass: BookingClass;
  public reisendeArray: Traveler[] = [];
  public isFound: boolean;
  public requested: boolean;

  constructor(
    private dialog: MatDialog,
    private bookingService: BookingService,
    private bookingclassService: BookingClassService,
    private travelerService: TravelerService,
    private toastrService: ToastrService
  ) {
    this.dialogConfiguration();
    this.loading = false;
    this.isFound = false;
    this.requested = false;
    this.bookingNb = "";
   }

  ngOnInit(): void {
    this.reisendeArray = [];
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  private resetValues() {
    this.bookingclass = null;
    this.reisendeArray = [];
    this.tripoffer = null;
  }

  getBooking() {
    // reset all
    this.resetValues();
    // change the state of the loader
    this.loading = this.bookingNb.length > 0;
    const input = this.bookingNb;
    if (this.bookingNb.length == 8) {
      let bnr = input.substring(0, 3).toUpperCase() + input.substring(3, input.length);
      this.requested = true;
      this.bookingService.getByBookingNummer(bnr).subscribe({
        next: (result) => {
          console.log(result);
          this.isFound = true;
          this.tripoffer = result;
        },
        error: () => {
          this.isFound = false;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          // get the booking class
          this.getBookingClassById(this.tripoffer.buchungsklasseId);
          this.getTravelerById(this.tripoffer.reisenderId);
          if (this.tripoffer.mitReisenderId) {
            this.getTravelerById(this.tripoffer.mitReisenderId);
          }
        }
      });
    } else if (this.bookingNb.length > 8) {
      this.isFound = false;
      this.loading = false;
    }
  }

  private getBookingClassById(bcId: string) {
    this.bookingclassService.getOne(bcId).subscribe({
      next: (result) => this.bookingclass = result,
      error: () => {
        this.toastrService.error(
          "Die Buchungsklasse konnte nicht gelesen werden.",
          "Fehler"
        );
      }
    });
  }

  private getTravelerById(travelerId: string) {
    this.travelerService.getOne(travelerId).subscribe({
      next: (result) => {
        this.reisendeArray.push(result)
        console.log(this.reisendeArray)
      },
      error: () => {
        this.toastrService.error(
          "Der Reseinder information konnte nicht gelesen werden.",
          "Fehler"
        );
      }
    });
  }

  cancelconfDialog(form: any) {
    this.dialog.open(form, this.dialogConfig);
  }

  pdfSpeichern() {
    // First get the booking by bn
    let id = this.tripoffer.id;
    this.bookingService.exportPdf(id);
  }

  cancelBooking() {
    this.bookingService.changeBookingStatus(this.tripoffer.id, BookingState.STORNIEREN).subscribe({
      next: (result) => {
        if (result) {
          this.toastrService.success('Deine Buchung wurde erfolgreich storniert.')
        }
      },
      error: (err) => {
        this.toastrService.error('Etwas ist schiefgelaufen. Bitte versuchen Sie spaeter nochmal.');
      },
      complete: () => this.resetValues()
    });
  }
}
