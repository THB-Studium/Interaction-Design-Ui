import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";

import { BookingClassService } from "src/app/services/booking-class/booking-class.service";
import { CountryService } from "src/app/services/country/country.service";
import { ExpectationsService } from "src/app/services/expectations/expectations.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { BookingClass } from "src/app/models/bookingClass";
import { Country } from "src/app/models/country";
import { Expectation } from "src/app/models/expectation";
import { TripOffer } from "src/app/models/tripOffer";
import { DomSanitizer } from "@angular/platform-browser";

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
  // Defines currentBookingclass
  currentBookingclass: BookingClass;
  // Defines countriesList
  countriesList: Country[];
  // Defines selectedCountry
  public selectedCountry: FormControl = new FormControl();

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private bookingclassService: BookingClassService,
    private expectationService: ExpectationsService,
    private sharedDataService: SharedDataService,
    private tripofferService: TripOfferService,
    private toastrService: ToastrService,
    private countryService: CountryService,
    private sanitizer: DomSanitizer
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    this.sharedDataService.isAddBtnClicked = false;
    this.getTripofferToBeUpdated();
  }

  ngAfterViewInit(): void {
    this.getAllCountries();

    this.sharedDataService.currentExpectation.subscribe((expectation) => {
      this.currentExpectation = expectation;
    });

    this.sharedDataService.currentBookingclass.subscribe(bc => this.currentBookingclass = bc);
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  getAllCountries() {
    this.countryService.getAll().subscribe({
      next: (countries) => this.countriesList = countries,
      error: () => this.toastrService.error('Die Länder konnten nicht zugegriefen werden', 'Fehler')
    });
  }

  getCountryById(id: string): Country {
    const country = this.countriesList.find(x => x.id === id);
    this.currentTripoffer.landId = country.id;
    return country;
  }

  getTripofferToBeUpdated() {
    let tripofferid = "";
    this.activatedRoute.params.subscribe({
      next: (param) => {
        tripofferid = param.id;
        this.tripofferService.getOne(tripofferid).subscribe({
          next: (resp) => {
            console.log(resp);
            //convert image
            let objectURL = resp.startbild;
            resp.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.currentTripoffer = resp;
            if (resp.landId) {
              this.currentTripoffer.landId = resp.landId;
            }

            if (resp.erwartungenReadListTO) {
              this.sharedDataService.changeCurrentExpectation(resp.erwartungenReadListTO);
            }

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
    });
  }

  /** Updates current trip offer */
  saveTripoffer() {
    if (!this.currentTripoffer.landId) {
      this.currentTripoffer.landId = this.selectedCountry?.value?.id
    }
    // first save the expectations
    this.saveExpectation().then((expectation) => {
      if (expectation) {
        this.sharedDataService.currenttripOfferSource
          .subscribe({
            next: (tripoffer) => {
              
              console.log(tripoffer)
              let tocreate = {
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
                erwartungenReadListTO: tripoffer.erwartungenReadListTO,
                buchungsklassenReadListTO: tripoffer.buchungsklassenReadListTO,
                landId: tripoffer.landId,
                startbild: tripoffer.startbild
              }

              this.tripofferService.updateOne(tocreate).subscribe({
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

  /**Opens dialog to add new Bookingclass */
  addBookingclassDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  /**Saves the new Bookingclass and update the list */
  saveBookingclass() {
    if (!this.currentBookingclass.id) {
      // set the value of the reiseangebot
      this.currentBookingclass.reiseAngebotId = this.currentTripoffer.id;
      // check whether it is an update or not
      if (this.sharedDataService.isAddBtnClicked) {
        this.bookingclassService.addOne(this.currentBookingclass).subscribe({
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
        this.bookingclassService.updateOne(this.currentBookingclass).subscribe({
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

  isTripFormValid(value: boolean) {
    this.isFormValid = value;
  }

  isModalFormValid(value: boolean) {
    this.isValid = value;
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
