import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
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
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-edit-country",
  templateUrl: "./edit-country.component.html",
  styleUrls: ["./edit-country.component.css"],
})
export class EditCountryComponent implements OnInit, AfterViewInit {
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines country
  country: Country;
  // Defines highlightForm
  highlightForm: Highlight;
  // Defines countryInfoForm
  countryInfoForm: CountryInformation;
  // Defines accommodationForm
  accommodationForm: Accommodation;
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
  // Defines toBeDelected
  toBeDelected: any;
  // Defines isAdd
  isAdd: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accommodationService: AccommodationService,
    private countryService: CountryService,
    private countryInfoService: CountryInformationService,
    private higlightService: HighlightService,
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    this.getCurrentCountry();
  }

  ngAfterViewInit(): void {
    this.sharedDataService.currentAccommodation.subscribe(currentValue => this.accommodationForm = currentValue);
    this.sharedDataService.currentCountryInfo.subscribe(currentCountryInfo => this.countryInfoForm = currentCountryInfo);
    this.sharedDataService.currentHighlight.subscribe(currentHighlight => this.highlightForm = currentHighlight);
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Read and save the value of the country from the data service
  getCurrentCountry() {
    this.activatedRoute.params.subscribe(param => {
      const id = param.id;
      this.countryService.getOne(id).subscribe({
        next: (country) => {
          console.log(country)
          this.country = country;
          this.countryInfos = this.country.landInfo;



          this.highlights = this.country.highlights.map(hight => {
            //convert image
            let objectURL = 'data:image/png;base64,' + hight.bild;
            hight.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            return hight;
          });
          this.accommodations = this.country.unterkunft.map(unter => {

            unter.bilder.map(bild => {
              //convert image
            let objectURL = 'data:image/png;base64,' + bild;
            unter.realImages.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
            });
            
            return unter;
          });
          // set the value of the country in the current component and also into the data service
          this.sharedDataService.changeCurrentCountry(this.country);
        },
        error: () => this.toastrService.error('Die Daten konnten nicht geladen werden', 'Fehler')
      });
    });
  }

  updateCountry() {
    this.sharedDataService.currentCountry.subscribe(curValue => {
      let formData = new FormData();
      formData.append('bild', new Blob([curValue.karte_bild], {
        type: "application/multipart/form-data",
      }));
      formData.append('land', new Blob([
        JSON.stringify({
          id: curValue.id,
          name: curValue.name,
          flughafen: curValue.flughafen,
          unterkunft_text: curValue.unterkunft_text
        })
      ], { type: 'application/json' }));

      this.countryService.updateOne(formData).subscribe({
        next: (updatedCountry) => this.sharedDataService.changeCurrentCountry(updatedCountry),
        error: () => this.error(),
        complete: () => this.success()
      });
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
    this.isAdd = true;
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveHighlight() {
    // set the value of the countryid before save it
    this.highlightForm.landId = this.country.id;
    console.log(this.highlightForm);

    let formData = new FormData();
    formData.append("bild", new Blob([this.highlightForm.bild], {
      type: "application/multipart/form-data",
    }));

    formData.append(
      "highlight",
      new Blob([JSON.stringify({
        id: this.highlightForm.id,
        description: this.highlightForm.description,
        name: this.highlightForm.name,
        landId: this.highlightForm.landId
      })], {
        type: "application/json",
      })
    );
    if (!this.highlightForm.id) {
      this.higlightService.addOne(formData).subscribe({
        next: (savedHighlight) => {
          this.sharedDataService.changeCurrentHighlight(savedHighlight);
          this.highlights.push(savedHighlight);
        },
        error: () => this.error(),
        complete: () => this.success()
      });
    } else {
      this.higlightService.updateOne(formData).subscribe({
        next: (savedHighlight) => {
          const idx = this.highlights.findIndex(x => x.id === savedHighlight.id);
          this.highlights[idx].description = savedHighlight.description;
          this.highlights[idx].name = savedHighlight.name;
          this.highlights[idx].bild = savedHighlight.bild;
          this.sharedDataService.changeCurrentHighlight(savedHighlight);
        },
        error: () => this.error(),
        complete: () => this.success()
      });
    }

    // set the flag to false
    this.isValid = false;
  }

  highlightDetails(highlight: Highlight, dialogForm: any) {
    this.highlightForm = highlight;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  editHighlight(highlight: Highlight, dialogForm: any) {
    this.isAdd = false;
    this.sharedDataService.isAddBtnClicked = false;
    this.sharedDataService.changeCurrentHighlight(highlight);
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteHeighlightDialog(highlight: Highlight, dialogForm: any) {
    this.toBeDelected = highlight;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteHighlight() {
    this.higlightService.deleteOne(this.toBeDelected.id).subscribe({
      next: () => {
        const idx = this.highlights.findIndex(x => x.id === this.toBeDelected.id);
        this.highlights.splice(idx, 1);
      },
      error: () => this.error(),
      complete: () => this.success()
    });
  }

  addAccommodationDialog(dialogForm: any) {
    this.isAdd = true;
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveAccommodation() {
    // set the value of the country id before save
    this.accommodationForm.landId = this.country.id;
    // formData building
    let formData = new FormData();

    formData.append(
      "files",
      new Blob([this.accommodationForm.bilder], {
        type: "application/multipart/form-data",
      })
    );

    formData.append(
      "unterkunft",
      new Blob([JSON.stringify(
        {
          id: this.accommodationForm.id,
          name: this.accommodationForm.name,
          beschreibung: this.accommodationForm.beschreibung,
          link: this.accommodationForm.link,
          adresse: this.accommodationForm.adresse,
          landId: this.accommodationForm.landId,
        }
      )], { type: "application/json" })
    );


    if (!this.accommodationForm.id) {
      this.accommodationService.addOne(formData).subscribe({
        next: (savedAccommodation) => {
          this.sharedDataService.changeCurrentAccommodation(savedAccommodation);
          this.accommodations.push(savedAccommodation);
        },
        error: () => this.error(),
        complete: () => this.success(),
      });
    } else {
      this.accommodationService.updateOne(this.accommodationForm).subscribe({
        next: (updatedAccommodation) => {
          const idx = this.accommodations.findIndex(x => x.id === updatedAccommodation.id);
          this.accommodations[idx].adresse = updatedAccommodation.adresse;
          this.accommodations[idx].beschreibung = updatedAccommodation.beschreibung;
          this.accommodations[idx].link = updatedAccommodation.link;
          this.accommodations[idx].name = updatedAccommodation.name;
          this.sharedDataService.changeCurrentAccommodation(updatedAccommodation);
        },
        error: () => this.error(),
        complete: () => this.success()
      });
    }
    // set the flag to false
    this.isValid = false;
  }


  accommodationDetails(accommodation: Accommodation, dialogForm: any) {
    this.accommodationForm = accommodation;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  editAccommodation(accommodation: Accommodation, dialogForm: any) {
    this.isAdd = false;
    this.sharedDataService.isAddBtnClicked = false;
    this.sharedDataService.changeCurrentAccommodation(accommodation);
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteAccommodationDialog(accommodation: Accommodation, dialogForm: any) {
    this.toBeDelected = accommodation;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteAccommodation() {
    this.accommodationService.deleteOne(this.toBeDelected.id).subscribe({
      next: () => {
        const idx = this.accommodations.findIndex(x => x.id === this.toBeDelected.id);
        this.accommodations.splice(idx, 1);
      },
      error: () => this.error(),
      complete: () => this.success()
    });
  }

  addCountryInfoDialog(dialogForm: any) {
    this.isAdd = true;
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveCountryInfo() {
    // set the value of the landid before the save
    this.countryInfoForm.landId = this.country.id;
    console.log(this.countryInfoForm);

    if (!this.countryInfoForm.id) {
      this.countryInfoService.addOne(this.countryInfoForm).subscribe({
        next: (savedInfo) => {
          this.sharedDataService.changeCurrentCountryInfo(savedInfo);
          this.countryInfos.push(savedInfo);
        },
        error: () => this.error(),
        complete: () => this.success(),
      });
    } else {
      this.countryInfoService.updateOne(this.countryInfoForm).subscribe({
        next: (savedInfo) => {
          const idx = this.countryInfos.findIndex(x => x.id === savedInfo.id);
          this.countryInfos[idx].titel = savedInfo.titel;
          this.countryInfos[idx].description = savedInfo.description;
          this.sharedDataService.changeCurrentCountryInfo(savedInfo);
        },
        error: () => this.error(),
        complete: () => this.success()
      });
    }
    // set the flag to false. Help to know when to enable the save button
    this.isValid = false;
  }

  editCountryInfo(cInfo: CountryInformation, dialogForm: any) {
    this.isAdd = false;
    this.sharedDataService.isAddBtnClicked = false;
    this.sharedDataService.changeCurrentCountryInfo(cInfo);
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  confirmCountryInfoDeletion(cInfo: CountryInformation, dialogForm: any) {
    this.toBeDelected = cInfo;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteCountryInfo() {
    this.countryInfoService.deleteOne(this.toBeDelected.id).subscribe({
      next: () => {
        // remove also from the displayed list
        const index = this.countryInfos.findIndex(x => x.id === this.toBeDelected.id);
        this.countryInfos.splice(index, 1);
      },
      error: () => this.toastrService.error('Diese Information konnte nicht gelöscht werden', 'Fehler'),
      complete: () => this.toastrService.success(`${this.toBeDelected.titel} wurde erfolgreich gelöscht`)
    });
  }

  private success() {
    this.toastrService.success(
      "Die Information wurde erfolgreich gespeichert."
    );
  }

  private error() {
    this.toastrService.error(
      "Die Information konnte nicht geändert werden.",
      "Fehler"
    );
  }

  // On error
  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }
}
