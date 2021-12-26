import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";
import { HighlightService } from "src/app/services/highlight/highlight.service";
import { AccommodationService } from "src/app/services/accommodation/accommodation.service";
import { CountryInformationService } from "src/app/services/country-information/country-information.service";

import { Country } from "src/app/models/country";
import { Highlight } from "src/app/models/highlight";
import { Accommodation } from "src/app/models/accommodation";
import { CountryInformation } from "src/app/models/countryInformation";

@Component({
  selector: "app-country-form",
  templateUrl: "./country-form.component.html",
  styleUrls: ["./country-form.component.css"],
})
export class CountryFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);
  // Defines highlightInput
  @ViewChild("highlightInput") highlightInput: ElementRef<HTMLInputElement>;
  // Defines accommodationInput
  @ViewChild("accommodationInput")
  accommodationInput: ElementRef<HTMLInputElement>;
  // Defines cuntryInfoInput
  @ViewChild("countryInfoInput") countryInfoInput: ElementRef<HTMLInputElement>;

  // Defines country
  countryForm = new FormGroup({
    // name
    name: new FormControl("", [Validators.required]),
    // airport
    airports: new FormControl("", [Validators.required]),
    // highligths
    highlights: new FormControl("", [Validators.required]),
    // accommodation
    accommodations: new FormControl("", [Validators.required]),
    // countryInfo
    countryinfo: new FormControl("", [Validators.required]),
  });

  // Defines toolTipDuration
  toolTipDuration = 300;

  // Defines currentCountry. Contains complet current country information.
  currentCountry: Country;
  // Defines currentCountryId. Contains the id of the current country. Helpfull to handle an edit process.
  currentCountryId: string = "";

  // Defines airportsArray
  airportsArray = new Set([]);
  // Defines separatorKeysCodes
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // Defines filteredHighlights
  filteredHighlights: Observable<string[]>;
  // Defines highligthsArray. The list of selected highlights
  highligthsArray: string[] = [];
  // Defines allHighlights. contains all highlights
  allHighlights: string[] = [];
  // Defines allHighlightsObjects
  allHighlightsObjects: Highlight[] = [];

  // Defines filteredAccommodations
  filteredAccommodations: Observable<string[]>;
  // Defines accommodationsArray
  accommodationsArray: string[] = [];
  // Defines allAccommodations
  allAccommodations: string[] = [];
  // Defines allAccommodationsObjects
  allAccommodationsObjects: Accommodation[] = [];

  // Defines filteredCountriesInfo
  filteredCountriesInfo: Observable<string[]>;
  // Defines countriesInfoArray
  countriesInfoArray: string[] = [];
  // Defines allCountriesInfo
  allCountriesInfo: string[] = [];
  // Defines allCountriesInfosObjects
  allCountriesInfosObjects: CountryInformation[] = [];

  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  //
  isValid = false;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService,
    private highlightService: HighlightService,
    private accommadationService: AccommodationService,
    private countryInfoService: CountryInformationService,
    private dialog: MatDialog
  ) {
    this.dialogConfiguration();

    this.filteredHighlights = this.countryForm
      .get("highlights")
      .valueChanges.pipe(
        startWith(null),
        map((highlight: string | null) =>
          highlight ? this._filter(highlight) : this.allHighlights.slice()
        )
      );

    this.filteredAccommodations = this.countryForm
      .get("accommodations")
      .valueChanges.pipe(
        startWith(null),
        map((accommodation: string | null) =>
          accommodation
            ? this._filterAccommodation(accommodation)
            : this.allAccommodations.slice()
        )
      );

    this.filteredCountriesInfo = this.countryForm
      .get("countryinfo")
      .valueChanges.pipe(
        startWith(null),
        map((info: string | null) =>
          info ? this._filterCountryInfo(info) : this.allCountriesInfo.slice()
        )
      );
  }

  ngOnInit(): void {
    // Initialize the array of highlights
    this.getAllHighlights();
    // Initialize the array of accommodations
    this.getAllAccommodations();
    // Initialize the array of countries information
    this.getAllcountriesInfo();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  private getAllHighlights() {
    this.highlightService.getAll().subscribe({
      next: (highlights) => {
        highlights.forEach((highlight) => {
          this.allHighlights.push(highlight.name);
        });
        // save as object list
        this.allHighlightsObjects = highlights;
      },
      error: () => {
        this.toastrService.error(
          "Die Highlights konnten nicht geladen werden.",
          "Fehler"
        );
      },
    });
  }

  private getAllAccommodations() {
    this.accommadationService.getAll().subscribe({
      next: (accommodations) => {
        accommodations.forEach((accommodation) => {
          this.allAccommodations.push(accommodation.name);
        });
        // save the as object
        this.allAccommodationsObjects = accommodations;
      },
      error: () => {
        this.toastrService.error(
          "Die Unterkünfte konnten nicht geladen werden.",
          "Fehler"
        );
      },
    });
  }

  private getAllcountriesInfo() {
    this.countryInfoService.getAll().subscribe({
      next: (values) => {
        values.forEach((value) => {
          this.allCountriesInfo.push(value.titel);
        });
        // save the list
        this.allCountriesInfosObjects = values;
      },
      error: () => {
        this.toastrService.error(
          "Die Länder Informationen konnten nicht geladen werden.",
          "Fehler"
        );
      },
    });
  }

  isModalFormValid(value: boolean) {
    this.isValid = value;
  }

  addHighlightDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveNewHighlight() {
    this.sharedDataService.currentHighlight.subscribe({
      next: (highlight) => {
        this.highlightService.addOne(highlight).subscribe({
          next: (savedHighlight) => {
            this.allHighlightsObjects.push(savedHighlight);
            this.highligthsArray.push(savedHighlight.name);
          },
          error: () => {
            this.toastrService.error(
              "Das Highlight konnte nicht gespeichert werden.",
              "Fehler"
            );
          },
          complete: () => {
            this.toastrService.success(
              "Das Highlight wurde erfolgreich gespeichert."
            );
          },
        });
      },
    });
    // set the flag to false
    this.isValid = false;
  }

  addAccommodationDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveNewAccommodation() {
    this.sharedDataService.currentAccommodation.subscribe({
      next: (accommodation) => {
        this.accommadationService.addOne(accommodation).subscribe({
          next: (savedAccommodation) => {
            this.allAccommodationsObjects.push(savedAccommodation);
            this.accommodationsArray.push(savedAccommodation.name);
          },
          error: () => {
            this.toastrService.error(
              "Die Unterkunft konnte nicht gespeichert werden.",
              "Fehler"
            );
          },
          complete: () => {
            this.toastrService.success(
              "Die Unterkunft wurde erfolgreich gespeichert."
            );
          },
        });
      },
    });
    // set the flag to false
    this.isValid = false;
  }

  addCountryInfoDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveNewCountryInfo() {
    this.sharedDataService.currentCountryInfo.subscribe({
      next: (value) => {
        this.countryInfoService.addOne(value).subscribe({
          next: (savedInfo) => {
            // Add to the list of country info objects
            this.allCountriesInfosObjects.push(savedInfo);
            // Also add his value to the array of selected items
            this.countriesInfoArray.push(savedInfo.titel);
          },
          error: () => {
            this.toastrService.error(
              "Die Information konnte nicht gespeichert werden.",
              "Fehler"
            );
          },
          complete: () => {
            this.toastrService.success(
              "Die Information wurde erfolgreich gespeichert."
            );
          },
        });
      },
    });
    // set the flag to false
    this.isValid = false;
  }

  private onFormValuesChanged(): void {
    this.countryForm.valueChanges.subscribe({
      next: () => {
        // Array of airports
        if (this.airportsArray.has(this.countryForm.value.airports)) {
          this.airportsArray.add(this.countryForm.value.airports);
        }

        // Find Highlight to be saved
        let selectedHighlights = [];
        this.highligthsArray.forEach((value) => {
          const index = this.allHighlightsObjects.findIndex(
            (x) => x.name.toLowerCase() === value.toLowerCase()
          );
          if (index > -1) {
            selectedHighlights.push(this.allHighlightsObjects[index]);
          }
        });

        // Find accommodations to be saved
        let selectedAccommodations = [];
        this.accommodationsArray.forEach((value) => {
          const index = this.allAccommodationsObjects.findIndex(
            (x) => x.name.toLowerCase() === value.toLowerCase()
          );
          if (index > -1) {
            selectedAccommodations.push(this.allAccommodationsObjects[index]);
          }
        });

        // Find countries info to bbe saved
        let selectedCountriesInfo = [];
        this.countriesInfoArray.forEach((value) => {
          const index = this.allCountriesInfosObjects.findIndex(
            (x) => x.titel.toLowerCase() === value.toLowerCase()
          );
          if (index > -1) {
            selectedCountriesInfo.push(this.allCountriesInfosObjects[index]);
          }
        });

        this.currentCountry = {
          id: null,
          name: this.countryForm.value.name,
          flughafen: Array.from(this.airportsArray),
          highlights: selectedHighlights,
          unterkunft: selectedAccommodations,
          infosLands: selectedCountriesInfo,
        };

        console.log(this.currentCountry);
        // check whether the form is valid or not
        //this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.countryForm.get("title").valid &&
      this.countryForm.get("description").valid
    ) {
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }

  // Navigates to country view
  navigateToCountriesList() {
    this.router.navigateByUrl("/countries");
  }

  // Adds new selected airport into the list of airports
  addAirportFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.airportsArray.add(event.value);
      event.chipInput!.clear();
    }
  }

  // Removes selected from the list of airports
  removeAirport(airport: string) {
    this.airportsArray.delete(airport);
  }

  //#region Highlights
  // Adds new selected highlight into the list of Highlights
  addHighlight(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    // Add our highlight
    if (value) {
      this.highligthsArray.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.countryForm.get("highlights").setValue(null);
  }

  // Removes selected from the list
  removeHighlight(highlight: string): void {
    const index = this.highligthsArray.indexOf(highlight);
    if (index >= 0) {
      this.highligthsArray.splice(index, 1);
    }
  }

  // autocompilation
  selected(event: MatAutocompleteSelectedEvent): void {
    this.highligthsArray.push(event.option.viewValue);
    this.highlightInput.nativeElement.value = "";
    this.countryForm.get("highlights").setValue(null);
  }

  // Values filter
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allHighlights.filter((highlight) =>
      highlight.toLowerCase().includes(filterValue)
    );
  }
  //#endregion Highlights

  //#region Accommodation
  addAccommodation(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    // Add our accommodation
    if (value) {
      this.accommodationsArray.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.countryForm.get("accommodations").setValue(null);
  }

  // Removes selected from the list
  removeAccommodation(accommodation: string): void {
    const index = this.accommodationsArray.indexOf(accommodation);
    if (index >= 0) {
      this.accommodationsArray.splice(index, 1);
    }
  }

  // autocompilation
  selectedAccommodation(event: MatAutocompleteSelectedEvent): void {
    this.accommodationsArray.push(event.option.viewValue);
    this.accommodationInput.nativeElement.value = "";
    this.countryForm.get("accommodations").setValue(null);
  }

  // Values filter
  private _filterAccommodation(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allAccommodations.filter((val) =>
      val.toLowerCase().includes(filterValue)
    );
  }
  //#endregion accommodation

  //#region countryInfo
  addCountryInfo(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    // Add our countryInfo
    if (value) {
      this.countriesInfoArray.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.countryForm.get("countryinfo").setValue(null);
  }

  // Removes selected from the list
  removeCountryInfo(countryinfo: string): void {
    const index = this.countriesInfoArray.indexOf(countryinfo);
    if (index >= 0) {
      this.countriesInfoArray.splice(index, 1);
    }
  }

  // autocompilation
  selectedCountryInfo(event: MatAutocompleteSelectedEvent): void {
    this.countriesInfoArray.push(event.option.viewValue);
    this.countryInfoInput.nativeElement.value = "";
    this.countryForm.get("countryinfo").setValue(null);
  }

  // Values filter
  private _filterCountryInfo(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCountriesInfo.filter((val) =>
      val.toLowerCase().includes(filterValue)
    );
  }
  //#endregion countryInfo

  alert() {
    alert("Hey");
  }
}
