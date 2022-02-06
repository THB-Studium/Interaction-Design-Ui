import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { MatChipInputEvent } from "@angular/material/chips";
import { formatDate } from "@angular/common";

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

  // tripoffer form
  tripofferForm = new FormGroup({
    // title
    title: new FormControl("", [Validators.required]),
    // image
    image: new FormControl("", [Validators.required]),
    // startdate
    startdate: new FormControl("", [Validators.required]),
    // enddate
    enddate: new FormControl("", [Validators.required]),
    // deadline
    deadline: new FormControl("", [Validators.required]),
    // totalplace
    totalplace: new FormControl("", [Validators.required]),
    // services
    services: new FormControl("", [Validators.required]),
    // authorizedtotravel
    authorizedtotravel: new FormControl("", [Validators.required]),
    // note
    note: new FormControl("", [Validators.required]),
    // othernote
    anothernote: new FormControl("", [Validators.required]),
  });

  // expectation form
  expectationForm = new FormGroup({
    adventure: new FormControl("", [Validators.min(0), Validators.max(100)]),
    comfort: new FormControl("", [Validators.min(0), Validators.max(100)]),
    deceleration: new FormControl("", [Validators.min(0), Validators.max(100)]),
    road: new FormControl("", [Validators.min(0), Validators.max(100)]),
    safety: new FormControl("", [Validators.min(0), Validators.max(100)]),
    sun_beach: new FormControl("", [Validators.min(0), Validators.max(100)]),
    sustainability: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ]),
  });

  // Defines serviceArray
  serviceArray = new Set([]);
  // Defines authorizedtotravelArray
  authorizedtotravelArray = new Set([]);
  // Defines note
  note: string;
  // Defines anothernote
  anothernote: string;
  // Defines currentTripofferId
  currentTripofferId: string;
  // Defines selectedFile
  selectedFile: any;
  fileInputByte: any;
  // Defines selectedFileNames
  selectedFileName: string[] = [];
  // Defines isImgSelected
  isImgSelected = false;
  // Defines error
  errors = {
    startdate: "",
    enddate: "",
    deadlinedate: "",
  };
  // Defines isValid
  isValid = false;
  // Defines isModalValid
  isModalValid = false;
  // Defines selectedStartDate
  selectedStartDate: any;
  // Defines selectedEndDate
  selectedEndDate: any;
  // Defines selectedDeadlineDate
  selectedDeadlineDate: any;
  isAdd = false;
  loading = true;

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
    this.note = "";
    this.anothernote = "";
    this.currentTripoffer = {
      titel: "",
      id: null,
      anmeldungsFrist: null,
      buchungsklassenReadListTO: null,
      buchungsklassen: null,
      endDatum: null,
      erwartungenReadListTO: null,
      erwartungen: null,
      freiPlaetze: 0,
      hinweise: "",
      interessiert: 0,
      landId: null,
      leistungen: [],
      mitReiserBerechtigt: null,
      plaetze: 0,
      sonstigeHinweise: "",
      startDatum: null,
      startbild: null,
      realImage: null,
    };
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.expectationForm.valueChanges.subscribe(() => {
      // if one of the value is bigger than 100, then disable the savee button
      if (
        this.expectationForm.value.adventure > 100 || this.expectationForm.value.adventure < 0 || 
        this.expectationForm.value.adventure === null ||
        this.expectationForm.value.comfort > 100 ||  this.expectationForm.value.comfort < 0 ||
        this.expectationForm.value.comfort === null ||
        this.expectationForm.value.deceleration > 100 || this.expectationForm.value.deceleration < 0 ||
        this.expectationForm.value.deceleration === null ||
        this.expectationForm.value.safety > 100 || this.expectationForm.value.safety < 0 ||
        this.expectationForm.value.safety === null ||
        this.expectationForm.value.road > 100 || this.expectationForm.value.road < 0 ||
        this.expectationForm.value.road === null ||
        this.expectationForm.value.sustainability > 100 || this.expectationForm.value.sustainability < 0 ||
        this.expectationForm.value.sustainability === null ||
        this.expectationForm.value.sun_beach > 100 || this.expectationForm.value.sun_beach < 0 ||
        this.expectationForm.value.sun_beach === null
      ) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    });

    this.sharedDataService.currentBookingclass.subscribe(
      (bc) => (this.currentBookingclass = bc)
    );

    this.onTripofferFormValueChamges();
  }

  private initForm() {
    this.activatedRoute.params.subscribe((param) => {
      if (param.id) {
        this.currentTripofferId = param.id;
        // Get the tripoffer from the api
        this.tripofferService.getOne(this.currentTripofferId).subscribe({
          next: (resp) => {
            //convert image
            let objectURL = "data:image/png;base64," + resp.startbild;
            resp.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.currentTripoffer = resp;
            // Get the default selected country
            this.getAllCountries();
          },
          error: () =>
            this.toastrService.error(
              "Die Daten konnten nicht geladen werden.",
              "Fehler"
            ),
          complete: () => {
            this.setcurrentTripofferForm(this.currentTripoffer);
            this.initExpectationForm(
              this.currentTripoffer.erwartungenReadListTO
            );
            this.isImgSelected = true;
            this.loading = false;
          },
        });
      } else {
        this.currentTripofferId = null;
      }
    });
  }

  private initExpectationForm(expectation: Expectation): void {
    this.currentExpectation = expectation;
    this.expectationForm.setValue({
      adventure: expectation?.abenteuer ?? 0,
      comfort: expectation?.konfort ?? 0,
      deceleration: expectation?.entschleunigung ?? 0,
      road: expectation?.road ?? 0,
      safety: expectation?.sicherheit ?? 0,
      sun_beach: expectation?.sonne_strand ?? 0,
      sustainability: expectation?.nachhaltigkeit ?? 0,
    });
  }

  private setcurrentTripofferForm(tripoffer: TripOffer) {
    // service array initialization
    this.serviceArray.clear();
    tripoffer.leistungen?.forEach((value) => this.serviceArray.add(value));

    // authorization array initialization
    this.authorizedtotravelArray.clear();
    tripoffer.mitReiserBerechtigt?.forEach((value) =>
      this.authorizedtotravelArray.add(value)
    );

    this.tripofferForm.setValue({
      title: tripoffer.titel,
      image: "",
      startdate: tripoffer.startDatum,
      enddate: tripoffer.endDatum,
      deadline: tripoffer.anmeldungsFrist,
      totalplace: tripoffer.plaetze,
      // The values will be loaded from the service array
      services: "",
      // The values will be loaded from the authorization array
      authorizedtotravel: "",
      note: tripoffer.hinweise,
      anothernote: tripoffer.sonstigeHinweise,
    });

    // Get and display the expectation
    this.sharedDataService.changeCurrentExpectation(
      tripoffer.erwartungenReadListTO
    );
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  getAllCountries() {
    this.countryService.getAll().subscribe({
      next: (countries) => (this.countriesList = countries),
      error: () => {
        this.toastrService.error(
          "Die Länder konnten nicht zugegriefen werden",
          "Fehler"
        );
      },
      complete: () => {
        if (this.currentTripoffer.landId) {
          this.getCountryById(this.currentTripoffer.landId);
        }
      },
    });
  }

  getCountryById(id: string) {
    // Get the default country from the countries list
    const idx = this.countriesList.findIndex((x) => x.id === id);
    this.selectedCountry.setValue(this.countriesList[idx]);
  }

  // Adds new selected service into the list of services
  addServiceFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.serviceArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isTripofferFormValid();
  }

  // Removes selected from the list of services
  removeService(service: string) {
    this.serviceArray.delete(service);
    // check whether the form is valid or not
    this.isTripofferFormValid();
  }

  // Adds new selected authorization into the list of authorizations
  addAuthorizationFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.authorizedtotravelArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isTripofferFormValid();
  }

  // Removes selected from the list of authorization
  removeAuthorization(auth: string) {
    this.authorizedtotravelArray.delete(auth);
    // check whether the form is valid or not
    this.isTripofferFormValid();
  }

  // On file selected
  selectFile(event: any): void {
    if (event.target.files) {
      this.selectedFileName.push(event.target.files.item(0).name);
      // set the value of the input
      this.tripofferForm.value.image = this.selectedFileName[0];
      // check whether the form is valid or not
      this.isTripofferFormValid();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileInputByte = reader.result;
      };
      this.isImgSelected = true;
      this.tripofferForm.get("image").setErrors(null);
    } else {
      this.isImgSelected = false;
      this.tripofferForm.get("image").setErrors({ valid: false });
    }
  }

  private isTripofferFormValid(): void {
    if (
      this.tripofferForm.get("title").valid &&
      this.tripofferForm.get("startdate").valid &&
      this.tripofferForm.get("enddate").valid &&
      this.isImgSelected &&
      this.tripofferForm.get("deadline").valid &&
      this.tripofferForm.get("totalplace").valid &&
      this.serviceArray.size > 0 &&
      this.authorizedtotravelArray.size > 0 &&
      this.tripofferForm.get("note").valid &&
      this.tripofferForm.get("anothernote").valid
    ) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  private onTripofferFormValueChamges() {
    this.tripofferForm.valueChanges.subscribe({
      next: () => this.isTripofferFormValid(),
    });
  }

  /**Saves new expectation and update the list */
  private saveExpectation(): Promise<Expectation> {
    return new Promise((resolve) => {
      // set the current value of the expectation to be saved
      const tobesaved: Expectation = {
        abenteuer: this.expectationForm.value.adventure,
        konfort: this.expectationForm.value.comfort,
        entschleunigung: this.expectationForm.value.deceleration,
        sicherheit: this.expectationForm.value.safety,
        road: this.expectationForm.value.road,
        nachhaltigkeit: this.expectationForm.value.sustainability,
        sonne_strand: this.expectationForm.value.sun_beach,
        reiseAngebotId: this.currentTripoffer.id,
        id: this.currentExpectation?.id,
      };
      // check whether it is an add or not. If the id is equal than null, than it is an add
      if (!this.currentExpectation?.id) {
        this.expectationService.addOne(tobesaved).subscribe({
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
        this.expectationService.updateOne(tobesaved).subscribe({
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

  isModalFormValid(value: boolean) {
    this.isModalValid = value;
  }

  /** Updates current trip offer */
  saveTripoffer() {
    // first save the expectations
    this.saveExpectation().then((expectation) => {
      if (expectation) {
        // Check if the dates are valid
        if (
          this.selectedStartDate === this.selectedEndDate &&
          this.selectedStartDate === this.selectedDeadlineDate
        ) {
          this.tripofferForm.get("enddate").setErrors({ valid: false });
        }

        let currentImg =
          this.currentTripoffer.realImage.changingThisBreaksApplicationSecurity;
        // Build objet to be saved
        let toUpdate = {
          id: this.currentTripofferId,
          startbild: this.isImgSelected ? this.fileInputByte : currentImg,
          titel: this.tripofferForm.get("title").value,
          startDatum: this.selectedStartDate,
          endDatum: this.selectedEndDate,
          anmeldungsFrist: this.selectedDeadlineDate,
          plaetze: this.tripofferForm.get("totalplace").value,
          freiPlaetze: this.tripofferForm.get("totalplace").value,
          interessiert: 0,
          leistungen: Array.from(this.serviceArray),
          mitReiserBerechtigt: Array.from(this.authorizedtotravelArray),
          hinweise: this.tripofferForm.get("note").value,
          sonstigeHinweise: this.tripofferForm.get("anothernote").value,
          erwartungen: expectation,
          erwartungenReadListTO: expectation,
          landId: this.selectedCountry?.value?.id,
          buchungsklassen: this.currentTripoffer.buchungsklassenReadListTO,
        };

        this.tripofferService.updateOne(toUpdate).subscribe({
          next: () => this.updateSuccess(),
          error: () => this.updateError(),
          complete: () => {
            if (toUpdate.buchungsklassen?.length == 0) {
              this.toastrService.info(
                "Es wurde für dieses Reiseangebot keine Buchungsklasse zugewiesen"
              );
            }

            if (!toUpdate.landId) {
              this.toastrService.info(
                "Es wurde für dieses Reiseangebot keines Ziel (Land) zugewiesen"
              );
            }

            this.navigateToTripoffersList();
          },
        });
      }
    });
  }

  /**Opens dialog to add new Bookingclass */
  addBookingclassDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.isAdd = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  /**Saves the new Bookingclass and update the list */
  saveBookingclass() {
    if (!this.currentBookingclass.id) {
      // set the value of the reiseangebot
      this.currentBookingclass.reiseAngebotId = this.currentTripoffer.id;
      // check whether it is an update or not
      this.bookingclassService.addOne(this.currentBookingclass).subscribe({
        next: (resp) =>
          this.currentTripoffer?.buchungsklassenReadListTO.push(resp),
        error: () => {
          this.toastrService.error(
            "Die Buchungsklasse konnte nicht gespeichert werden.",
            "Fehler"
          );
        },
        complete: () => {
          this.toastrService.success(
            "Die Buchungsklasse wurde erfolgreich gespeichert."
          );
        },
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

    this.isModalValid = false;
  }

  editBookingclass(bc: BookingClass, dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = false;
    this.isAdd = false;
    // Get bookingclass information
    this.bookingclassService.getOne(bc.id).subscribe({
      next: (result) => this.sharedDataService.changeCurrentBookinclass(result),
      error: () => {
        this.toastrService.error(
          "Die Buchungsklasse konnte nicht geladen werden"
        );
      },
      complete: () => this.dialog.open(dialogForm, this.dialogConfig),
    });
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
        error: () => {
          this.toastrService.error(
            "Die Buchunsklasse konnte nicht entfernt werden.",
            "Fehler."
          );
        },
        complete: () => {
          this.toastrService.success(
            "Die Buchungsklasse wurde erfolgreich entfernt."
          );
        },
      });
  }

  editExpectation(exp: Expectation, dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = false;
    this.isAdd = false;
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
        error: () => {
          this.toastrService.error(
            "Die Erwartung konnte nicht entfernt werden.",
            "Fehler."
          );
        },
        complete: () => {
          this.toastrService.success(
            "Die Erwartung wurde erfolgreich entfernt."
          );
        },
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
    this.ngOnInit();
  }

  private updateError() {
    this.toastrService.error(
      "Die Änderungen konnten nicht gespeichert werden.",
      "Fehler"
    );
  }

  /**This method will not compare the time*/
  compareDates(date1: string, date2: string): number {
    if (date1 < date2) return -1;
    else if (date1 > date2) return 1;
    return 0;
  }

  onStartDateSelected(selectedDate) {
    const selecteddate = selectedDate.target.value;

    this.selectedStartDate =
      selecteddate !== ""
        ? formatDate(selecteddate, "yyyy-MM-dd", "en_US")
        : formatDate(null, "yyyy-MM-dd", "en_US");
    const today = formatDate(new Date(), "yyyy-MM-dd", "en_US");

    const diff = this.compareDates(this.selectedStartDate, today);
    // Check whether the selected date is valid or not
    if (diff === -1) {
      this.errors.startdate = "Die Eingabe stimmt nicht.";
    }
  }

  onEndDateSelected(selectedDate) {
    const selecteddate = selectedDate.target.value;

    this.selectedEndDate =
      selecteddate !== ""
        ? formatDate(selecteddate, "yyyy-MM-dd", "en_US")
        : formatDate(null, "yyyy-MM-dd", "en_US");

    const diff = this.compareDates(
      this.selectedEndDate,
      this.selectedStartDate
    );
    // Check whether the selected date is valid or not
    if (diff === -1) {
      this.errors.enddate =
        "Die Eingabe stimmt nicht. Das Startdatum mal schauen.";
    }
  }

  onDeadlineDateSelected(selectedDate) {
    const selecteddate = selectedDate.target.value;
    this.selectedDeadlineDate =
      selecteddate !== ""
        ? formatDate(selecteddate, "yyyy-MM-dd", "en_US")
        : formatDate(null, "yyyy-MM-dd", "en_US");
    // Check whether the selected date is valid or not
    const diff1 = this.compareDates(
      this.selectedDeadlineDate,
      this.selectedStartDate
    );
    const diff2 = this.compareDates(
      this.selectedDeadlineDate,
      this.selectedEndDate
    );
    if (diff1 === -1 || diff2 === 1) {
      this.errors.deadlinedate =
        "Die Eingabe stimmt nicht. Das Start-&Enddatum mal schauen";
    }
  }

  clearStartDateError() {
    this.errors.startdate = "";
  }

  clearEndDateError() {
    this.errors.enddate = "";
  }

  clearDeadlineDateError() {
    this.errors.deadlinedate = "";
  }

  resetSaveModalButton() {
    this.isModalValid = false;
  }
}
