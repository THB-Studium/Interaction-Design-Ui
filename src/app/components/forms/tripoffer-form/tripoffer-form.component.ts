/**Todo: convert image array to file, before passing to the form. Add the image name to the form*/
import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { ActivatedRoute } from "@angular/router";

import { FormControl, FormGroup, Validators } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { TripOffer } from "src/app/models/tripOffer";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tripoffer-form",
  templateUrl: "./tripoffer-form.component.html",
  styleUrls: ["./tripoffer-form.component.css"],
})
export class TripofferFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines tripofferForm
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
  // Defines isValid
  isValid = false;
  // Defines currentTripoffer
  currentTripoffer: TripOffer;
  // Defines currentTripofferId
  currentTripofferId: string;
  // Defines selectedFile
  selectedFile?: any;
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

  constructor(private sharedDataService: SharedDataService) {
    this.note = "";
    this.anothernote = "";
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
  }

  private initForm() {
    this.currentTripoffer = {
      id: "",
      titel: "",
      anmeldungsFrist: new Date(),
      startDatum: new Date(),
      endDatum: new Date(),
      startbild: null,
      plaetze: 0,
      freiPlaetze: 0,
      interessiert: 0,
      leistungen: [],
      mitReiserBerechtigt: [],
      hinweise: "",
      sonstigeHinweise: "",
      landId: "",
      buchungsklassenReadListTO: null,
      erwartungenReadListTO: null,
      erwartungen: null,
      buchungsklassen: null
    };
  }

  // Adds new selected service into the list of services
  addServiceFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.serviceArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isFormValid();
  }

  // Removes selected from the list of services
  removeService(service: string) {
    this.serviceArray.delete(service);
    // check whether the form is valid or not
    this.isFormValid();
  }

  // Adds new selected authorization into the list of authorizations
  addAuthorizationFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.authorizedtotravelArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isFormValid();
  }

  // Removes selected from the list of authorization
  removeAuthorization(auth: string) {
    this.authorizedtotravelArray.delete(auth);
    // check whether the form is valid or not
    this.isFormValid();
  }

  private onFormValuesChanged(): void {
    this.tripofferForm.valueChanges.subscribe({
      next: () => {
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if(
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
      // The module returns the selected date - 1day, so we need to add 1day to the selected date before save it
      let startdate = this.tripofferForm.get("startdate").value;
      let enddate = this.tripofferForm.get("enddate").value;
      let deadlinedate = this.tripofferForm.get("deadline").value;

      this.currentTripoffer = {
        id: this.currentTripofferId,
        startbild: this.currentTripoffer?.startbild,
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
        buchungsklassenReadListTO: null,
        erwartungen: null,
        buchungsklassen: null
      };

      this.sharedDataService.changeCurrentTripOffer(this.currentTripoffer);
      // Check if the dates are valid
      if (startdate === enddate && startdate === deadlinedate) {
        this.tripofferForm.get("enddate").setErrors({'valid': false});
        // notify the parent
        this.notifyFormIsValid.emit(false);
      } else {
        // notify the parent
        this.notifyFormIsValid.emit(true);
      }
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }

  // On file selected
  selectFile(event: any): void {
    this.selectedFileName = [];
    this.selectedFile = event.target.files;
    if (this.selectedFile && this.selectedFile.item(0)) {
      //this.isImgSelected = true;
      this.selectedFileName.push(this.selectedFile.item(0).name);
      // set the value of the input
      this.tripofferForm.value.image = this.selectedFileName[0];
      // check whether the form is valid or not
      this.isFormValid();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.selectedFile = reader.result;
          this.currentTripoffer.startbild = reader.result;
      };

      this.isImgSelected = true;
      this.tripofferForm.get("image").setErrors(null);
    } else {
      this.isImgSelected = false;
      this.tripofferForm.get("image").setErrors({ valid: false });
    }

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
      this.notifyFormIsValid.emit(false);
    } else {
      // check whether the form is valid or not
      this.isFormValid();
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
      this.notifyFormIsValid.emit(false);
    } else {
      // check whether the form is valid or not
      this.isFormValid();
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
      this.notifyFormIsValid.emit(false);
    } else {
      // check whether the form is valid or not
      this.isFormValid();
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
