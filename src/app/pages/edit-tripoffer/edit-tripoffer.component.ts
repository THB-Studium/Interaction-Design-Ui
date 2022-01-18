import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";

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
import { MatChipInputEvent } from "@angular/material/chips";

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
  isFormValid = true;

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
      titel: '',
      id: null,
      anmeldungsFrist: null,
      buchungsklassenReadListTO: null,
      endDatum: null,
      erwartungenReadListTO: null,
      freiPlaetze: 0,
      hinweise: '',
      interessiert: 0,
      landId: null,
      leistungen: [],
      mitReiserBerechtigt: null,
      plaetze: 0,
      sonstigeHinweise: '',
      startDatum: null,
      startbild: null,
      realImage: null,
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.getAllCountries();

    this.sharedDataService.currentExpectation.subscribe((expectation) => {
      this.currentExpectation = expectation;
    });

    this.sharedDataService.currentBookingclass.subscribe(bc => this.currentBookingclass = bc);
  }

  private initForm() {
    // Check whether it is an edit or add. If there is id as key from the url, than it is an edit
    this.activatedRoute.params.subscribe((param) => {
      if (param.id) {
        this.currentTripofferId = param.id;
        // read the tripoffer from the api
        this.tripofferService.getOne(this.currentTripofferId).subscribe({
          next: (resp) => {
            //convert image
            let objectURL = 'data:image/png;base64,' + resp.startbild;
            resp.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);

            this.currentTripoffer = resp;
          },
          error: () =>
            this.toastrService.error(
              "Die Daten konnten nicht geladen werden.",
              "Fehler"
            ),
          complete: () => {
            this.setcurrentTripofferForm(this.currentTripoffer);
          },
        });
      } else {
        this.currentTripofferId = null;
      }
    });
  }

  private setcurrentTripofferForm(tripoffer: TripOffer) {
    // service array
    this.serviceArray.clear();
    tripoffer.leistungen?.forEach((value) => this.serviceArray.add(value));

    // authorization array
    this.authorizedtotravelArray.clear();
    tripoffer.mitReiserBerechtigt?.forEach((value) =>
      this.authorizedtotravelArray.add(value)
    );

    // In order to display the really value of the date, we need to remove 1day from the date. Since the datepicker module display the given date + 1day
    let startdate = new Date(
      new Date(tripoffer.startDatum).getFullYear(),
      new Date(tripoffer.startDatum).getMonth(),
      new Date(tripoffer.startDatum).getDate() - 1
    );
    let enddate = new Date(
      new Date(tripoffer.endDatum).getFullYear(),
      new Date(tripoffer.endDatum).getMonth(),
      new Date(tripoffer.endDatum).getDate() - 1
    );
    let deadlinedate = new Date(
      new Date(tripoffer.anmeldungsFrist).getFullYear(),
      new Date(tripoffer.anmeldungsFrist).getMonth(),
      new Date(tripoffer.anmeldungsFrist).getDate() - 1
    );

    this.tripofferForm.setValue({
      title: tripoffer.titel,
      image: "", // todo: add image name here
      startdate: startdate,
      enddate: enddate,
      deadline: deadlinedate,
      totalplace: tripoffer.plaetze,
      // The value will be readed from the array
      services: "",
      authorizedtotravel: "",
      note: tripoffer.hinweise,
      anothernote: tripoffer.sonstigeHinweise,
    });
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

  // Adds new selected service into the list of services
  addServiceFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.serviceArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isFormValid_();
  }

  // Removes selected from the list of services
  removeService(service: string) {
    this.serviceArray.delete(service);
    // check whether the form is valid or not
    this.isFormValid_();
  }

  // Adds new selected authorization into the list of authorizations
  addAuthorizationFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.authorizedtotravelArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isFormValid_();
  }

  // Removes selected from the list of authorization
  removeAuthorization(auth: string) {
    this.authorizedtotravelArray.delete(auth);
    // check whether the form is valid or not
    this.isFormValid_();
  }

  private isFormValid_(): void {
    // The module returns the selected date - 1day, so we need to add 1day to the selected date before save it
    let startdate = this.tripofferForm.get("startdate").value;
    let enddate = this.tripofferForm.get("enddate").value;
    let deadlinedate = this.tripofferForm.get("deadline").value;

    /*let toUpdate = {
      id: this.currentTripofferId,
      startbild: this.isImgSelected ? this.selectFile : this.currentTripoffer.startbild,
      titel: this.tripofferForm.get("title").value,
      startDatum: startdate.setDate(startdate.getDate() + 1),
      endDatum: enddate.setDate(enddate.getDate() + 1),
      anmeldungsFrist: deadlinedate.setDate(deadlinedate.getDate() + 1),
      plaetze: this.tripofferForm.get("totalplace").value,
      freiPlaetze: this.tripofferForm.get("totalplace").value,
      interessiert: 0,
      leistungen: Array.from(this.serviceArray),
      mitReiserBerechtigt: Array.from(this.authorizedtotravelArray),
      hinweise: this.tripofferForm.get("note").value,
      sonstigeHinweise: this.tripofferForm.get("anothernote").value,
      erwartungenReadListTO: null,
      landId: null,
      buchungsklassenReadListTO: null
    };*/

    // Check if the dates are valid
    if (startdate === enddate && startdate === deadlinedate) {
      this.tripofferForm.get("enddate").setErrors({ 'valid': false });
    }
  }

  // On file selected
  selectFile(event: any): void {
    if (event.target.files) {
      this.selectedFileName.push(event.target.files.item(0).name);
      // set the value of the input
      this.tripofferForm.value.image = this.selectedFileName[0];
      // check whether the form is valid or not
      this.isFormValid_();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileInputByte = reader.result;
      };
      this.isImgSelected = true;
    } else {
      this.isImgSelected = false;
    }

  }

  /** Updates current trip offer */
  saveTripoffer() {
    // first save the expectations
    this.saveExpectation().then((expectation) => {
      if (expectation) {
        console.log(expectation)
        // The module returns the selected date - 1day, so we need to add 1day to the selected date before save it
        let startdate = this.tripofferForm.get("startdate").value;
        let enddate = this.tripofferForm.get("enddate").value;
        let deadlinedate = this.tripofferForm.get("deadline").value;

        let currentImg = this.currentTripoffer.realImage.changingThisBreaksApplicationSecurity;
        let toUpdate = {
          id: this.currentTripofferId,
          startbild: this.isImgSelected ? this.fileInputByte : currentImg,
          titel: this.tripofferForm.get("title").value,
          startDatum: startdate.setDate(startdate.getDate() + 1),
          endDatum: enddate.setDate(enddate.getDate() + 1),
          anmeldungsFrist: deadlinedate.setDate(deadlinedate.getDate() + 1),
          plaetze: this.tripofferForm.get("totalplace").value,
          freiPlaetze: this.tripofferForm.get("totalplace").value,
          interessiert: 0,
          leistungen: Array.from(this.serviceArray),
          mitReiserBerechtigt: Array.from(this.authorizedtotravelArray),
          hinweise: this.tripofferForm.get("note").value,
          sonstigeHinweise: this.tripofferForm.get("anothernote").value,
          erwartungenReadListTO: expectation,
          landId: this.selectedCountry?.value?.id,
          buchungsklassenReadListTO: this.currentTripoffer.buchungsklassenReadListTO
        };

        console.log('toUpdate', toUpdate)
        this.tripofferService.updateOne(toUpdate).subscribe({
          next: () => {
            this.updateSuccess();
          },
          error: () => this.updateError(),
        });

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

  editBookingclass(bc: BookingClass, dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = false;
    // Get bookingclass information
    this.bookingclassService.getOne(bc.id).subscribe({
      next: (result) => this.sharedDataService.changeCurrentBookinclass(result),
      error: () => this.toastrService.error('Die Buchungsklasse konnte nicht geladen werden'),
      complete: () => this.dialog.open(dialogForm, this.dialogConfig)
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
    this.ngOnInit();
  }

  private updateError() {
    this.toastrService.error(
      "Die Änderungen konnten nicht gespeichert werden.",
      "Fehler"
    );
  }

  /**This method will not compare the time*/
  compareDates(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    if (d1 < d2) return -1;
    else if (d1 > d2) return 1;
    return 0;
  }

  onStartDateSelected(selectedDate) {
    const selecteddate = selectedDate.target.value;
    const diff = this.compareDates(selecteddate, new Date());
    // Check whether the selected date is valid or not
    if (diff === -1) {
      this.errors.startdate = "Die Eingabe stimmt nicht.";
      // notify the parent that the form is not valid
      //this.notifyFormIsValid.emit(false);
    } else {
      // check whether the form is valid or not
      this.isFormValid_();
    }
  }

  onEndDateSelected(selectedDate) {
    const selecteddate = selectedDate.target.value;
    const startdate = new Date(this.tripofferForm.value.startdate);

    const diff = this.compareDates(selecteddate, startdate);
    // Check whether the selected date is valid or not
    if (diff === -1) {
      this.errors.enddate =
        "Die Eingabe stimmt nicht. Das Startdatum mal schauen.";
      // notify the parent that the form is not valid
      //this.notifyFormIsValid.emit(false);
    } else {
      // check whether the form is valid or not
      this.isFormValid_();
    }
  }

  onDeadlineDateSelected(selectedDate) {
    const selecteddate = selectedDate.target.value;
    //
    const startdate = new Date(this.tripofferForm.value.startdate);
    const enddate = new Date(this.tripofferForm.value.enddate);
    // Check whether the selected date is valid or not
    const diff1 = this.compareDates(selecteddate, startdate);
    const diff2 = this.compareDates(selecteddate, enddate);
    if (diff1 === -1 || diff2 === 1) {
      this.errors.deadlinedate =
        "Die Eingabe stimmt nicht. Das Start-&Enddatum mal schauen";
      // notify the parent that the form is not valid
      //this.notifyFormIsValid.emit(false);
    } else {
      // check whether the form is valid or not
      this.isFormValid_();
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
}
