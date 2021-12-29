import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Country } from "src/app/models/country";

@Component({
  selector: "app-country-form",
  templateUrl: "./country-form.component.html",
  styleUrls: ["./country-form.component.css"],
})
export class CountryFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines country
  countryForm = new FormGroup({
    // name
    name: new FormControl("", [Validators.required]),
    // airport
    airports: new FormControl("", [Validators.required]),
    // text
    accommodation_text: new FormControl("", [Validators.required])
  });

  // Defines currentCountry. Contains complet current country information.
  currentCountry: Country;
  // Defines currentCountryId. Contains the id of the current country. Helpfull to handle an edit process.
  currentCountryId: string = "";

  // Defines airportsArray
  airportsArray = new Set([]);

  // Defines isAnAdd
  isAnAdd = false;
  // Defines isValid
  isValid = false;

  constructor(
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
  }

  private initForm() {
    // read the current method to be executed
    this.isAnAdd = this.sharedDataService.isAddBtnClicked;
    // If it is not an add
    if (!this.isAnAdd) {
      this.sharedDataService.currentCountry.subscribe({
        next: (country) => {
          this.currentCountry = country;
          this.setCountryForm(country);
          this.currentCountryId = country.id;
        }
      }).unsubscribe();
    }
  }

  private setCountryForm(country: Country) {
    this.airportsArray.clear();
    country.flughafen.forEach(value => this.airportsArray.add(value));
     
    this.countryForm.setValue({
      name: country.name,
      accommodation_text: country.unterkunft_text,
      airports:  this.airportsArray
    });
  }

  // Adds new selected airport into the list of airports
  addAirportFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.airportsArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isFormValid();
  }

  // Removes selected from the list of airports
  removeAirport(airport: string) {
    this.airportsArray.delete(airport);
    // check whether the form is valid or not
    this.isFormValid();
  }

  private onFormValuesChanged(): void {
    this.countryForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentCountryId;
        }

        this.currentCountry = {
          id: id,
          name: this.countryForm.get('name').value,
          flughafen: Array.from(this.airportsArray),
          unterkunft_text: this.countryForm.get('accommodation_text').value
        };
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.countryForm.get("name").valid &&
      this.countryForm.get("accommodation_text").valid && this.airportsArray.size > 0
    ) {
      this.sharedDataService.changeCurrentCountry(this.currentCountry);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }
}
