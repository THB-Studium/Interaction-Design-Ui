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
  // Defines expectationsArray
  expectations: Expectation;
  // Defines bookingclasstobedeleted
  bookingclasstobedeleted: BookingClass;
  // Defines expectationtobedeleted
  expectationtobedeleted: Expectation;
  // Defines expectationSaved
  expectationSaved = false;
  //
  currentExpectation: Expectation;

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
    //this.getAllBookingClass();
    //this.getAllExpectations();
  }

  ngAfterViewInit(): void {
    this.sharedDataService.currentExpectation.subscribe((expectation) => {
      this.currentExpectation = expectation;
    });
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  getTripofferToBeUpdated() {
    let tripofferid = "";
    this.activatedRoute.params.subscribe({
      next: (param) => {
        tripofferid = param.id;
        this.tripofferService.getOne(tripofferid).subscribe({
          next: (resp) => {
            console.log(resp);
            this.currentTripoffer = resp;
            this.sharedDataService.changeCurrentTripOffer(
              this.currentTripoffer
            );

            if (resp.erwartungenReadListTO)
              this.sharedDataService.changeCurrentExpectation(resp.erwartungenReadListTO);
          },
          error: () =>
            this.toastrService.error(
              "Die Daten konnten nicht geladen werden.",
              "Fehler"
            ),
        });
      },
    });
  }

  /*getAllBookingClass() {
    this.bookingclassService.getAll().subscribe({
      next: (bgs) => {
        console.log(bgs)
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
  }*/

  /*getAllExpectations() {
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
  }*/

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
              next: (resp) =>
                this.currentTripoffer?.buchungsklassenReadListTO.push(resp),
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
                const idx =
                  this.currentTripoffer?.buchungsklassenReadListTO.findIndex(
                    (x) => x.id === resp.id
                  );
                this.currentTripoffer.buchungsklassenReadListTO[idx] = resp;
              },
              error: () => this.updateError(),
              complete: () => this.updateSuccess(),
            });
          }
        }
      })
      .unsubscribe();
  }

  /**Saves new expectation and update the list */
  private saveExpectation(): Promise<Expectation> {
    return new Promise((resolve) => {
      // set the value of the reiseangebot
      this.currentExpectation.reiseAngebotId = this.currentTripoffer.id;
      // check whether it is an add or not. If the id is equal than null, than it is an add
      if (!this.currentExpectation.id) {
        this.expectationService.addOne(this.currentExpectation).subscribe({
          next: (resp) => resolve(resp),
          error: () => {
            this.expectationSaved = false;
            this.toastrService.error(
              "Die Erwartungen konnten nicht gespeichert werden.",
              "Fehler"
            );
          },
          complete: () => (this.expectationSaved = true),
        });
      } else {
        this.expectationService.updateOne(this.currentExpectation).subscribe({
          next: (resp) => resolve(resp),
          error: () => {
            this.expectationSaved = false;
            this.toastrService.error(
              "Die Änderungen konnten nicht gespeichert werden.",
              "Fehler"
            );
          },
          complete: () => (this.expectationSaved = true),
        });
      }
    });
  }

  /** Updates current trip offer */
  saveTripoffer() {
    // first save the expectations
    this.saveExpectation().then((expectation) => {
      if (expectation) {
        let formData = new FormData();
        this.sharedDataService.currenttripOfferSource
          .subscribe({
            next: (tripoffer) => {
              formData.append("bild", null);
              formData.append(
                "reiseAngebot",
                new Blob(
                  [
                    JSON.stringify({
                      id: this.currentTripoffer.id,
                      titel: tripoffer.titel,
                      startDatum: tripoffer.startDatum,
                      endDatum: tripoffer.endDatum,
                      anmeldungsFrist: tripoffer.anmeldungsFrist,
                      plaetze: tripoffer.plaetze,
                      freiPlaetze: tripoffer.freiPlaetze,
                      leistungen: tripoffer.leistungen,
                      interessiert: tripoffer.interessiert,
                      mitReiserBerechtigt: tripoffer.mitReiserBerechtigt,
                      hinweise: tripoffer.hinweise,
                      sonstigeHinweise: tripoffer.sonstigeHinweise,
                      erwartungenReadListTO: expectation,
                      buchungsklassenReadListTO:
                        tripoffer.buchungsklassenReadListTO,
                      landId: tripoffer.landId,
                    }),
                  ],
                  { type: "application/json" }
                )
              );

              this.tripofferService.updateOne(formData).subscribe({
                next: () => {
                  this.updateSuccess();
                },
                error: () => this.updateError(),
              });
            },
          })
          .unsubscribe();
      }
    });
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
          const idx =
            this.currentTripoffer?.buchungsklassenReadListTO.findIndex(
              (x) => x.id === this.bookingclasstobedeleted.id
            );
          this.currentTripoffer?.buchungsklassenReadListTO.splice(idx, 1);
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
        next: () => (this.currentTripoffer.erwartungenReadListTO = null),
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
