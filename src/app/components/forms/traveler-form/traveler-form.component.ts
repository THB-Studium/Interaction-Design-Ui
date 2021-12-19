import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Traveler } from "src/app/models/Traveler";
import { Pattern } from "src/app/variables/pattern";

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
  readonly answerArray = ["Ja", "Nein"];
  // Defines error
  errors = {
    dateOfBirth: "",
  };
  // Defines dob (date of birth)
  dob: string;
  // Defines isDobValid
  isDobValid = false;

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
      // the form has to ne initialized as well
      this.sharedDataService.currentTraveler
        .subscribe((traveler) => {
          const day = parseInt(traveler.geburtsdatum.split("/")[0]);
          const month = parseInt(traveler.geburtsdatum.split("/")[1]);
          const year = parseInt(traveler.geburtsdatum.split("/")[3]);
          // adress
          const street = traveler.adress.split(",")[0];
          const postal = traveler.adress.split(",")[1].split(" ")[0];
          const city = traveler.adress.split(",")[1].split(" ")[1];

          this.travelerForm.setValue({
            lastname: traveler.name,
            firstname: traveler.vorname,
            birthday: new Date(year, month, day),
            email: traveler.email,
            street: street,
            postal: postal,
            city: city,
            mobile: traveler.telefonnummer,
            university: traveler.hochschule,
            faculty: traveler.studiengang,
            participated: traveler.schonTeilgenommen,
            workfor: traveler.arbeitBei,
          });
          // save the current id
          this.currentTravelerId = traveler.id;
        })
        .unsubscribe(); // unsubscribe directly to avoid recursion
    }
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
    const dob = new Date(selectedDate.target.value);
    const day = dob.getDate();
    const month = dob.getMonth() + 1; // Since the method returns from 0 - 11
    const year = dob.getFullYear();

    /** The 3 following variables are timestamp type */
    const today = new Date().getTime();
    // The user should not be older than 1940
    const maxDate = Date.UTC(1940, 1, 1);
    // If is an adult.
    const minDate = Date.UTC(2003, 1, 1);

    // Check whether the selected date is valid or not
    //const resultOfComparaison = this.compareDate(dob.getTime(), minDate
    if (
      dob.getTime() > today ||
      (dob.getTime() < today && dob.getTime() > minDate) ||
      dob.getTime() > minDate
    ) {
      this.errors.dateOfBirth = "Es werden nur Erwachsener zugelassen.";
      // set dob to not valid
      this.isDobValid = false;
      // notify the parent that the form is not valid
      this.notifyTravelerFormValid.emit(false);
    } else if (dob.getTime() < maxDate) {
      this.errors.dateOfBirth = "Älter als 80 Jahre wird nicht zugelassen.";
      // set dob to not valid
      this.isDobValid = false;
      // notify the parent that the form is not valid
      this.notifyTravelerFormValid.emit(false);
    } else {
      // set dob to valid
      this.isDobValid = true;
      // Set the value of dob. To be saved later.
      this.dob = `${day}/${month}/${year}`;
      this.travelerForm.get("birthday").setValue(new Date(year, month, day));
      this.isFormValid();
    }
  }

  // Always get the value from the form and update the current traveler information when any input value changed.
  private onFormValuesChanged(): void {
    this.travelerForm.valueChanges.subscribe(() => {
      var id = null;
      if (!this.isAnAdd) {
        id = this.currentTravelerId;
      }

      this.currentTraveler = {
        id: id,
        vorname: this.transformName(this.travelerForm.value.lastname),
        name: this.transformName(this.travelerForm.value.firstname),
        geburtsdatum: this.dob,
        email: this.travelerForm.value.email,
        adress: `${this.travelerForm.value.street}, ${this.travelerForm.value.postal} ${this.travelerForm.value.city}`,
        telefonnummer: this.travelerForm.value.mobile,
        hochschule: this.travelerForm.value.university,
        studiengang: this.travelerForm.value.faculty,
        schonTeilgenommen: this.travelerForm.value.participated,
        arbeitBei: this.travelerForm.value.workfor,
      };

      this.isFormValid();
      console.log(this.currentTraveler);
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
      this.sharedDataService.changeCurrentTraveler(this.currentTraveler);
      // notify the parent that the form is valid
      this.notifyTravelerFormValid.emit(true);
    } else {
      // notify the parent that the form is not valid
      this.notifyTravelerFormValid.emit(false);
    }
  }

  // Transforms the first character of the lastname and firstname to upper
  private transformName(name: string): string {
    name = name.trim().toString();
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
