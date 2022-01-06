import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { BookingClassService } from "src/app/services/booking-class/booking-class.service";
import { ExpectationsService } from "src/app/services/expectations/expectations.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { TripOffer } from "src/app/models/tripOffer";
import { BookingClass } from "src/app/models/bookingClass";
import { Expectation } from "src/app/models/expectation";

@Component({
  selector: "app-edit-tripoffer",
  templateUrl: "./edit-tripoffer.component.html",
  styleUrls: ["./edit-tripoffer.component.css"],
})
export class EditTripofferComponent implements OnInit, AfterViewInit {
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines currentTripoffer
  currentTripoffer: TripOffer;
  // Defines isValid
  isValid = false;
  // Defines isFormValid. Fire when the tripofferform is valid
  isFormValid = true;
  // Defines bookingclassArray
  bookingclassArray: BookingClass[] = [];
  // Defines expectationsArray
  expectationsArray: Expectation[] = [];
  // Defines bookingclasstobedeleted
  bookingclasstobedeleted: BookingClass;
  // Defines expectationtobedeleted
  expectationtobedeleted: Expectation;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private bookingclassService: BookingClassService,
    private expectationService: ExpectationsService,
    private sharedDataService: SharedDataService,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    this.sharedDataService.isAddBtnClicked = false;
    this.getTripofferToBeUpdated();
    this.getAllBookingClass();
    this.getAllExpectations();
  }

  ngAfterViewInit(): void {}

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  getTripofferToBeUpdated() {
    let tripofferid = "";
    this.activatedRoute.params
      .subscribe({
        next: (param) => {
          tripofferid = param.id;
          this.tripofferService.getOne(tripofferid).subscribe({
            next: (resp) => {
              this.currentTripoffer = resp;
              this.sharedDataService.changeCurrentTripOffer(
                this.currentTripoffer
              );
            },
            error: () =>
              this.toastrService.error(
                "Die Daten konnten nicht geladen werden.",
                "Fehler"
              ),
          });
        },
      })
      .unsubscribe();
  }

  getAllBookingClass() {
    this.bookingclassService.getAll().subscribe({
      next: (bgs) => {
        this.bookingclassArray = bgs.filter(
          (x) => x.reiseAngebotId === this.currentTripoffer?.id
        );
      },
      error: () =>
        this.toastrService.error(
          "Die dazugehorigen Buchungsklassen konnten nicht geladen werden.",
          "Fehler"
        ),
    });
  }

  getAllExpectations() {
    this.expectationService.getAll().subscribe({
      next: (exps) => {
        this.expectationsArray = exps.filter(
          (x) => x.reiseAngebotId === this.currentTripoffer?.id
        );
      },
      error: () =>
        this.toastrService.error(
          "Die dazugehorigen Erwartungen konnten nicht geladen werden.",
          "Fehler"
        ),
    });
  }

  /**Opens dialog to add new Bookingclass */
  addBookingclassDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  /**Saves the new Bookingclass and update the list */
  saveBookingclass() {
    this.sharedDataService.currentBookingclass
      .subscribe((bookingclass) => {
        if (bookingclass) {
          // set the value of the reiseangebot
          bookingclass.reiseAngebotId = this.currentTripoffer.id;
          // check whether it is an update or not
          if (this.sharedDataService.isAddBtnClicked) {
            this.bookingclassService.addOne(bookingclass).subscribe({
              next: (resp) => this.bookingclassArray.push(resp),
              error: () =>
                this.toastrService.error(
                  "Die Buchungsklasse konnte nicht gespeichert werden.",
                  "Fehler"
                ),
              complete: () =>
                this.toastrService.success(
                  "Die Buchungsklasse wurde erfolgreich gespeichert."
                ),
            });
          } else {
            this.bookingclassService.updateOne(bookingclass).subscribe({
              next: (resp) => {
                const idx = this.bookingclassArray.findIndex(
                  (x) => x.id === resp.id
                );
                this.bookingclassArray[idx] = resp;
              },
              error: () => this.updateError(),
              complete: () => this.updateSuccess(),
            });
          }
        }
      })
      .unsubscribe();
  }

  /**Opens dialog to add new expectation */
  addExpectationDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  /**Saves new expectation and update the list */
  saveExpectation() {
    this.sharedDataService.currentExpectation
      .subscribe((expectation) => {
        if (expectation) {
          // set the value of the reiseangebot
          expectation.reiseAngebotId = this.currentTripoffer.id;
          // check whether it is an add or not
          if (this.sharedDataService.isAddBtnClicked) {
            this.expectationService.addOne(expectation).subscribe({
              next: (resp) => this.expectationsArray.push(resp),
              error: () =>
                this.toastrService.error(
                  "Die Erwartung konnte nicht gespeichert werden.",
                  "Fehler"
                ),
              complete: () =>
                this.toastrService.success(
                  "Die Erwartung wurde erfolgreich gespeichert."
                ),
            });
          } else {
            this.expectationService.addOne(expectation).subscribe({
              next: (resp) => {
                const idx = this.expectationsArray.findIndex(
                  (x) => x.id === resp.id
                );
                this.expectationsArray[idx] = resp;
              },
              error: () => this.updateError(),
              complete: () => this.updateSuccess(),
            });
          }
        }
      })
      .unsubscribe();
  }

  /** Updates current trip offer */
  saveTripoffer() {
    this.sharedDataService.currenttripOfferSource
      .subscribe({
        next: (tripoffer) => {
          this.tripofferService.updateOne(tripoffer).subscribe({
            next: () => {
              this.updateSuccess();
            },
            error: () => this.updateError(),
          });
        },
      })
      .unsubscribe();
  }

  isTripFormValid(value: boolean) {
    this.isFormValid = value;
  }

  isModalFormValid(value: boolean) {
    this.isValid = value;
  }

  editBookingclass(bc: BookingClass, dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = false;
    this.sharedDataService.changeCurrentBookinclass(bc);
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteBookingclassDialog(bc: BookingClass, dialogForm: any) {
    this.bookingclasstobedeleted = bc;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteBookingclass() {
    this.bookingclassService
      .deleteOne(this.bookingclasstobedeleted.id)
      .subscribe({
        next: () => {
          const idx = this.bookingclassArray.findIndex(
            (x) => x.id === this.bookingclasstobedeleted.id
          );
          this.bookingclassArray.splice(idx, 1);
        },
        error: () =>
          this.toastrService.error(
            "Die Buchunsklasse konnte nicht entfernt werden.",
            "Fehler."
          ),
        complete: () =>
          this.toastrService.success(
            "Die Buchungsklasse wurde erfolgreich entfernt."
          ),
      });
  }

  editExpectation(exp: Expectation, dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = false;
    this.sharedDataService.changeCurrentExpectation(exp);
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteExpectationDialog(exp: Expectation, dialogForm: any) {
    this.expectationtobedeleted = exp;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteExpectation() {
    this.expectationService
      .deleteOne(this.expectationtobedeleted.id)
      .subscribe({
        next: () => {
          const idx = this.expectationsArray.findIndex(
            (x) => x.id === this.expectationtobedeleted.id
          );
          this.expectationsArray.splice(idx, 1);
        },
        error: () =>
          this.toastrService.error(
            "Die Erwartung konnte nicht entfernt werden.",
            "Fehler."
          ),
        complete: () =>
          this.toastrService.success(
            "Die Erwartung wurde erfolgreich entfernt."
          ),
      });
  }

  /**Navigate to the list of offers */
  navigateToTripoffersList() {
    this.router.navigate(["/tripoffers"]);
  }

  private updateSuccess() {
    this.toastrService.success(
      "Die Änderungen wurden erfolgreich gespeichert."
    );
  }

  private updateError() {
    this.toastrService.error(
      "Die Änderungen konnten nicht gespeichert werden.",
      "Fehler"
    );
  }
}
