import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { AccommodationService } from "src/app/services/accommodation/accommodation.service";
import { CountryService } from "src/app/services/country/country.service";
import { CountryInformationService } from "src/app/services/country-information/country-information.service";
import { HighlightService } from "src/app/services/highlight/highlight.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";

import { Country } from "src/app/models/country";
import { Highlight } from "src/app/models/highlight";
import { Accommodation } from "src/app/models/accommodation";
import { CountryInformation } from "src/app/models/countryInformation";

@Component({
  selector: "app-edit-country",
  templateUrl: "./edit-country.component.html",
  styleUrls: ["./edit-country.component.css"],
})
export class EditCountryComponent implements OnInit {
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines country
  country: Country;
  // Defines highlights
  highlights: Highlight[] = [];
  // Defines accommodations
  accommodations: Accommodation[] = [];
  // Defines countryInfos
  countryInfos: CountryInformation[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines isValid
  isValid: boolean = false;
  // Defines isCountryFromValid
  isCountryFromValid: boolean = false;
  // Defines errors
  errors = {
    errorMessage: "",
  };

  constructor(
    private router: Router,
    private accommodationService: AccommodationService,
    private countryService: CountryService,
    private countryInfoService: CountryInformationService,
    private higlightService: HighlightService,
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    this.getCurrentCountry();
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Read and save the value of the country from the data service
  getCurrentCountry() {
    this.sharedDataService.currentCountry.subscribe({
      next: (country) => (this.country = country),
    });
  }

  getCountryAccommodations() {
    this.accommodationService.getAll().subscribe({
      next: (accommodations) =>
        (this.accommodations = accommodations.filter(
          (x) => (x.landId = this.country.id)
        )),
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `Die Unterkünfte für das Land konnten nicht geladen werden.`,
          "Fehler"
        );
      },
    });
  }

  getCountryHighlights() {
    this.higlightService.getAll().subscribe({
      next: (highlights) =>
        (this.highlights = highlights.filter(
          (x) => (x.landId = this.country.id)
        )),
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `Die Highlights für das Land konnten nicht geladen werden.`,
          "Fehler"
        );
      },
    });
  }

  getCountryInfos() {
    this.countryInfoService.getAll().subscribe({
      next: (infos) =>
        (this.countryInfos = infos.filter((x) => (x.landId = this.country.id))),
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `Die Informationen für das Land konnten nicht geladen werden.`,
          "Fehler"
        );
      },
    });
  }

  navigateToCountriesList() {
    this.router.navigate(["/countries"]);
  }

  isCountryFormValid(value: boolean) {
    this.isCountryFromValid = value;
  }

  isModalFormValid(value: boolean) {
    this.isValid = value;
  }

  addHighlightDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveHighlight() {
    this.sharedDataService.currentHighlight.subscribe({
      next: (highlight) => {
        this.highlights.push(highlight)
        /*this.higlightService.addOne(highlight).subscribe({
          next: (savedHighlight) => {
            this.highlights.push(savedHighlight);
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
        });*/
      },
    });
    // set the flag to false
    this.isValid = false;
  }

  addAccommodationDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveAccommodation() {
    this.sharedDataService.currentAccommodation.subscribe({
      next: (accommodation) => {
        this.accommodations.push(accommodation)
        /*this.accommodationService.addOne(accommodation).subscribe({
          next: (savedAccommodation) => {
            this.accommodations.push(savedAccommodation);
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
        });*/
      },
    });
    // set the flag to false
    this.isValid = false;
  }

  addCountryInfoDialog(dialogForm: any) {
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveCountryInfo() {
    this.sharedDataService.currentCountryInfo.subscribe({
      next: (value) => {
        this.countryInfos.push(value);
        /*this.countryInfoService.addOne(value).subscribe({
          next: (savedInfo) => {
            this.countryInfos.push(savedInfo);
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
        });*/
      },
    });
    // set the flag to false
    this.isValid = false;
  }

  // On error
  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }
}
