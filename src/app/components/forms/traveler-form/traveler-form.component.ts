import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Traveler } from "src/app/models/traveler";
import { Pattern } from "src/app/variables/pattern";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-traveler-form",
  templateUrl: "./traveler-form.component.html",
  styleUrls: ["./traveler-form.component.css"],
})
export class TravelerFormComponent implements OnInit, AfterViewInit {
  // Defines notifyTravelerFormValid. Notify the parent when the form is valid
  @Output() notifyTravelerFormValid = new EventEmitter<boolean>(false);

  // Defines TravelerForm
  travelerForm = new FormGroup({
    // lastname
    lastname: new FormControl("", [Validators.required]),
    // firstname
    firstname: new FormControl("", [Validators.required]),
    // email
    email: new FormControl("", [Validators.required, Validators.email]),
    // birthday
    birthday: new FormControl("", [Validators.required]),
    // street + houseNb
    street: new FormControl("", [
      Validators.required,
      Validators.pattern(Pattern.street),
    ]),
    // postal
    postal: new FormControl("", [
      Validators.required,
      Validators.pattern(Pattern.onlyNumber),
    ]),
    // city
    city: new FormControl("", [Validators.required]),
    // mobile
    mobile: new FormControl("", [
      Validators.required,
      Validators.pattern(Pattern.mobile),
    ]),
    // university
    university: new FormControl("", [Validators.required]),
    // faculty
    faculty: new FormControl("", [Validators.required]),
    // participated
    participated: new FormControl("", [Validators.required]),
    // workfor
    workfor: new FormControl(),
  });

  // Defines currentTraveler. Contains complet current traveler information.
  currentTraveler: Traveler;
  // Defines currentTravelerId. Contains the id of the current traveler. Helpfull to handle an edit process.
  currentTravelerId: string = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAnAdd: boolean = true;
  // selection
  readonly chooseArray = ["Ja", "Nein"];
  // Defines error
  errors = {
    dateOfBirth: "",
  };
  // Defines isDobValid
  isDobValid = false;
  // Defines selectedDate
  selectedDate: any;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.initTravelerForm();
  }

  ngAfterViewInit() {
    this.onFormValuesChanged();
  }

  // Calls on onload. This will help to know if we want to edit an traveler or add a new one.
  // The method need the shareDataService as well, to populate those information.
  private initTravelerForm() {
    // read the current method to be executed
    this.isAnAdd = this.sharedDataService.isAddBtnClicked;
    // If it is not an add
    if (!this.isAnAdd) {
      // Since every the dob is valid
      this.isDobValid = true;
      // the form has to ne initialized as well
      this.sharedDataService.currentTraveler
        .subscribe((traveler) => {
          // set the value of the current traveler
          this.currentTraveler = traveler;
          this.setTravelerForm(traveler);
          // save the current id
          this.currentTravelerId = traveler.id;
        })
        .unsubscribe(); // unsubscribe directly to avoid recursion
    }
  }

  private setTravelerForm(traveler: Traveler) {
    // set date to be display
    const day = parseInt(
      traveler.geburtsdatum.toString().split("T")[0].split("-")[2]
    );
    const month = parseInt(
      traveler.geburtsdatum.toString().split("T")[0].split("-")[1]
    );
    const year = parseInt(
      traveler.geburtsdatum.toString().split("T")[0].split("-")[0]
    );
    // adress
    let street = "";
    let postal = "";
    let city = "";
    if (traveler.adresse && traveler.adresse.split(",").length >= 1) {
      street = traveler.adresse.split(",")[0];
      if (traveler.adresse.split(",").length > 1) {
        postal = traveler.adresse.split(",")[1].split(" ")[1];
        if (traveler.adresse.split(",")[1].split(" ").length >= 3) {
          city = traveler.adresse.split(",")[1].split(" ")[2];
        }
      }
    }
    this.travelerForm.setValue({
      lastname: traveler.name,
      firstname: traveler.vorname,
      birthday: new Date(year, month - 1, day).toISOString(),
      email: traveler.email,
      street: street,
      postal: postal,
      city: city,
      mobile: `+${traveler.telefonnummer}`, // Since number has been saved without the 0 before (int)
      university: traveler.hochschule,
      faculty: traveler.studiengang,
      participated: traveler.schonTeilgenommen
        ? this.chooseArray[0]
        : this.chooseArray[1],
      workfor: traveler.arbeitBei,
    });
  }

  // Clear notification on click on input date.
  clearDobError() {
    this.errors.dateOfBirth = "";
  }

  // Notify whether the date of birth is valid or not.
  notifyOnDateOfBirthInvalid() {
    if (this.isDobValid) {
      this.errors.dateOfBirth = "";
    } else {
      this.errors.dateOfBirth = "Die Eingabe ist ungültig.";
      // Check if the form is valid
      this.isFormValid();
    }
  }

  // Checks whether the selected date of birth is valid or not
  onDateSelected(selectedDate) {
    const dob = selectedDate.target.value;
    this.selectedDate =
      dob !== ""
        ? formatDate(dob, "yyyy-MM-dd", "en_US")
        : formatDate(null, "yyyy-MM-dd", "en_US");
    const today = formatDate(new Date(), "yyyy-MM-dd", "en_US");
    // The user should not be older than 1940
    const maxDate = formatDate(new Date(1940, 1, 1), "yyyy-MM-dd", "en_US");
    // If is an adult.
    const minDate = formatDate(new Date(2003, 1, 1), "yyyy-MM-dd", "en_US");

    // Check whether the selected date is valid or not
    if (
      this.selectedDate > today ||
      (this.selectedDate < today && this.selectedDate > minDate) ||
      this.selectedDate > minDate
    ) {
      this.errors.dateOfBirth = "Es werden nur Erwachsener zugelassen.";
      // set dob to not valid
      this.isDobValid = false;
      // notify the parent that the form is not valid
      this.notifyTravelerFormValid.emit(false);
    } else if (this.selectedDate < maxDate) {
      this.errors.dateOfBirth = "Älter als 80 Jahre wird nicht zugelassen.";
      // set dob to not valid
      this.isDobValid = false;
      // notify the parent that the form is not valid
      this.notifyTravelerFormValid.emit(false);
    } else {
      // set dob to valid
      this.isDobValid = true;
      // check whether the form is valid or not
      this.isFormValid();
    }
  }

  // Always get the value from the form and update the current traveler information when any input value changed.
  private onFormValuesChanged(): void {
    this.travelerForm.valueChanges.subscribe(() => {
      // check whether the form is valid or not
      this.isFormValid();
    });
  }

  // Check whether the form is valid or not
  private isFormValid() {
    if (
      this.travelerForm.get("lastname").valid &&
      this.travelerForm.get("firstname").valid &&
      this.isDobValid &&
      this.travelerForm.get("email").valid &&
      this.travelerForm.get("mobile").valid &&
      this.travelerForm.get("street").valid &&
      this.travelerForm.get("postal").valid &&
      this.travelerForm.get("city").valid &&
      this.travelerForm.get("university").valid &&
      this.travelerForm.get("faculty").valid &&
      this.travelerForm.get("participated").valid
    ) {
      var id = null;
      if (!this.isAnAdd) {
        id = this.currentTravelerId;
      }

      this.currentTraveler = {
        id: id,
        vorname: this.firstCharacterToUpper(this.travelerForm.value.firstname),
        name: this.firstCharacterToUpper(this.travelerForm.value.lastname),
        geburtsdatum: this.selectedDate,
        email: this.travelerForm.value.email,
        adresse: `${this.firstCharacterToUpper(
          this.travelerForm.value.street
        )}, ${this.travelerForm.value.postal} ${this.firstCharacterToUpper(
          this.travelerForm.value.city
        )}`,
        telefonnummer: parseInt(this.travelerForm.value.mobile),
        hochschule: this.firstCharacterToUpper(
          this.travelerForm.value.university
        ),
        studiengang: this.firstCharacterToUpper(
          this.travelerForm.value.faculty
        ),
        schonTeilgenommen:
          this.travelerForm.value.participated === this.chooseArray[0],
        arbeitBei: this.firstCharacterToUpper(this.travelerForm.value.workfor),
      };

      this.sharedDataService.changeCurrentTraveler(this.currentTraveler);
      // notify the parent that the form is valid
      this.notifyTravelerFormValid.emit(true);
    } else {
      // notify the parent that the form is not valid
      this.notifyTravelerFormValid.emit(false);
    }
  }

  // Transforms the first character of the string to upper
  private firstCharacterToUpper(value: string): string {
    if (value) {
      value = value.trim().toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return "";
  }
}
