import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {AccommodationService} from 'src/app/services/accommodation/accommodation.service';
import {CountryService} from 'src/app/services/country/country.service';
import {CountryInformationService} from 'src/app/services/country-information/country-information.service';
import {HighlightService} from 'src/app/services/highlight/highlight.service';
import {SharedDataService} from 'src/app/services/sharedData/shared-data.service';
import {ToastrService} from 'ngx-toastr';

import {Country} from 'src/app/models/country';
import {Highlight} from 'src/app/models/highlight';
import {Accommodation} from 'src/app/models/accommodation';
import {CountryInformation} from 'src/app/models/countryInformation';
import {DomSanitizer} from '@angular/platform-browser';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CountryInformationFormComponent } from '../../components/forms/country-information-form/country-information-form.component';
import { AccommodationFormComponent } from '../../components/forms/accommodation-form/accommodation-form.component';
import { HighlightFormComponent } from '../../components/forms/highlight-form/highlight-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { NgIf, NgFor } from '@angular/common';
import {RoutingPaths} from '../../shared/const';

@Component({
    selector: 'app-edit-country',
    templateUrl: './edit-country.component.html',
    styleUrls: ['./edit-country.component.css'],
    standalone: true,
    imports: [
        NgIf,
        SpinnerComponent,
        MatCardModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        ColorPickerModule,
        MatToolbarModule,
        NgFor,
        MatChipsModule,
        MatExpansionModule,
        MatDialogModule,
        HighlightFormComponent,
        AccommodationFormComponent,
        CountryInformationFormComponent,
    ],
})
export class EditCountryComponent implements OnInit, AfterViewInit {
  // Defines countryForm
  countryForm = new FormGroup({
    // name
    name: new FormControl('', [Validators.required]),
    // airport
    airports: new FormControl('', [Validators.required]),
    // text
    accommodation_text: new FormControl('', [Validators.required]),
    // image
    image: new FormControl(undefined, [Validators.required]),
  });
  // Defines airportsArray
  airportsArray = new Set([]);
  // Defines isImgSelected
  isImgSelected = false;
  // Defines selectedFileName
  selectedFileName: string;
  // Defines selectedFile
  selectedFile?: any;
  fileInputByte: any;
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
  // Defines attachedImages
  attachedImages = [];
  // Defines countryInfos
  countryInfos: CountryInformation[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines isValid
  isValid: boolean = false;
  // Defines errors
  errors = {
    errorMessage: '',
  };
  // Defines toBeDelected
  toBeDelected: any;
  // Defines isAdd
  isAdd: boolean = true;
  //
  isModalValid = false;
  // Defines loading
  loading = true;
  headercolor: string;
  footercolor: string;

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
    this.headercolor = 'rgb(45, 146, 171)';
    this.footercolor = 'rgb(45, 146, 171)';
  }

  ngOnInit(): void {
    this.getCurrentCountry();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
    // Get the value of the accommodation Form from the sharedservice on value changes
    // on any value changes the current values will automaticaly saved in accommodationForm
    this.sharedDataService.currentAccommodation.subscribe(
      (currentValue) => (this.accommodationForm = currentValue)
    );
    // Get the value of the countryInfo Form from the sharedservice on value changes
    this.sharedDataService.currentCountryInfo.subscribe(
      (currentCountryInfo) => (this.countryInfoForm = currentCountryInfo)
    );
    // Get the value of the highlight Form from the sharedservice on value changes
    this.sharedDataService.currentHighlight.subscribe(
      (currentHighlight) => (this.highlightForm = currentHighlight)
    );
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Read and save the value of the country from the data service
  getCurrentCountry() {
    this.activatedRoute.params.subscribe((param) => {
      const id = param.id;
      this.countryService.getOne(id).subscribe({
        next: (country) => {
          //convert image
          let objectURL = 'data:image/png;base64,' + country.karte_bild;
          country.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);

          this.country = country;

          this.setcurrentCountryForm(this.country);

          this.countryInfos = this.country.landInfo;

          this.highlights = this.country.highlights.map((hight) => {
            //convert image
            let objectURLHigh = 'data:image/png;base64,' + hight.bild;
            hight.realImage =
              this.sanitizer.bypassSecurityTrustUrl(objectURLHigh);
            return hight;
          });

          this.accommodations = this.country.unterkunft;

          // set the value of the country in the current component and also into the data service
          this.sharedDataService.changeCurrentCountry(this.country);
        },
        error: () =>
          this.toastrService.error(
            'Die Daten konnten nicht geladen werden',
            'Fehler'
          ),
        complete: () => {
          this.isImgSelected = true;
          // set loading flag to false
          this.loading = false;
        },
      });
    });
  }

  updateCountry() {
    let currentImg =
      this.country.realImage.changingThisBreaksApplicationSecurity;

    let toUpdate = {
      id: this.country.id,
      name: this.countryForm.get('name').value,
      flughafen: Array.from(this.airportsArray),
      unterkunft_text: this.countryForm.get('accommodation_text').value,
      image: this.isImgSelected ? this.fileInputByte : currentImg,
      bodyFarbe: this.footercolor,
      headerFarbe: this.headercolor,
    };

    this.countryService.updateOne(toUpdate).subscribe({
      next: (updatedCountry) =>
        this.sharedDataService.changeCurrentCountry(updatedCountry),
      error: () => this.error(),
      complete: () => {
        // notify success save
        this.success();
        // notify if any object is missing
        if (this.countryInfos.length === 0) {
          this.toastrService.info(
            'Es wurde keine Information über das Land hinzugefügt.'
          );
        }

        if (this.highlights.length === 0) {
          this.toastrService.info('Es wurde keines Highlight hinzugefügt.');
        }

        if (this.accommodations.length === 0) {
          this.toastrService.info('Es wurde keine Unterkunft hinzugefügt.');
        }

        this.navigateToCountriesList();
      },
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

  selectFile(event: any) {
    this.selectedFile = event.target.files;
    if (this.selectedFile && this.selectedFile.item(0)) {
      this.isImgSelected = true;
      this.selectedFileName = this.selectedFile.item(0).name;
      // display the name
      this.countryForm.value.image = this.selectedFileName;
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileInputByte = reader.result;
      };
    } else {
      this.isImgSelected = false;
    }
    // check whether the form is valid or not
    this.isFormValid();
  }

  navigateToCountriesList() {
    this.router.navigate(['/' + RoutingPaths.COUNTRY]);
  }

  addHighlightDialog(dialogForm: any) {
    this.isAdd = true;
    this.sharedDataService.isAddBtnClicked = true;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveHighlight() {
    // set the value of the countryid before save it
    this.highlightForm.landId = this.country.id;

    let tobesaved = {
      id: this.highlightForm.id,
      name: this.highlightForm.name,
      description: this.highlightForm.description,
      landId: this.highlightForm.landId,
      bild: this.highlightForm.realImage,
    };

    if (!this.highlightForm.id) {
      this.higlightService.addOne(tobesaved).subscribe({
        next: (savedHighlight) => {
          this.sharedDataService.changeCurrentHighlight(savedHighlight);
          this.highlights.push(savedHighlight);
        },
        error: () => this.error(),
        complete: () => this.success(),
      });
    } else {
      this.higlightService.updateOne(tobesaved).subscribe({
        next: (savedHighlight) => {
          const idx = this.highlights.findIndex(
            (x) => x.id === savedHighlight.id
          );
          this.highlights[idx].description = savedHighlight.description;
          this.highlights[idx].name = savedHighlight.name;
          this.highlights[idx].bild = savedHighlight.bild;
          this.sharedDataService.changeCurrentHighlight(savedHighlight);
        },
        error: () => this.error(),
        complete: () => this.success(),
      });
    }

    this.isModalValid = false;
  }

  highlightDetails(highlight: Highlight, dialogForm: any) {
    this.higlightService.getOne(highlight.id).subscribe({
      next: (response) => {
        this.highlightForm = response;
        let objectURLHigh = 'data:image/png;base64,' + response.bild;
        this.highlightForm.realImage =
          this.sanitizer.bypassSecurityTrustUrl(objectURLHigh);
      },
      error: () => {
        this.toastrService.error(
          'Die Information konnten nicht geladen werden'
        );
      },
      complete: () => this.dialog.open(dialogForm, this.dialogConfig),
    });
  }

  editHighlight(highlight: Highlight, dialogForm: any) {
    this.isAdd = false;
    this.sharedDataService.isAddBtnClicked = false;
    this.higlightService.getOne(highlight.id).subscribe({
      next: (response) =>
        this.sharedDataService.changeCurrentHighlight(response),
      error: () => {
        this.toastrService.error(
          'Die Information konnten nicht geladen werden'
        );
      },
      complete: () => this.dialog.open(dialogForm, this.dialogConfig),
    });
  }

  deleteHeighlightDialog(highlight: Highlight, dialogForm: any) {
    this.toBeDelected = highlight;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteHighlight() {
    this.higlightService.deleteOne(this.toBeDelected.id).subscribe({
      next: () => {
        const idx = this.highlights.findIndex(
          (x) => x.id === this.toBeDelected.id
        );
        this.highlights.splice(idx, 1);
      },
      error: () => this.error(),
      complete: () => this.success(),
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
    let toBeSaved = {
      name: this.accommodationForm.name,
      adresse: this.accommodationForm.adresse,
      beschreibung: this.accommodationForm.beschreibung,
      landId: this.accommodationForm.landId,
      link: this.accommodationForm.link,
      id: this.accommodationForm.id,
      bilder: this.accommodationForm.bilder,
    };

    if (!this.accommodationForm.id) {
      this.accommodationService.addOne(toBeSaved).subscribe({
        next: (savedAccommodation) => {
          this.sharedDataService.changeCurrentAccommodation(savedAccommodation);
          this.accommodations.push(savedAccommodation);
        },
        error: () => this.error(),
        complete: () => this.success(),
      });
    } else {
      this.accommodationService.updateOne(toBeSaved).subscribe({
        next: (updatedAccommodation) => {
          const idx = this.accommodations.findIndex(
            (x) => x.id === updatedAccommodation.id
          );
          this.accommodations[idx].adresse = updatedAccommodation.adresse;
          this.accommodations[idx].beschreibung =
            updatedAccommodation.beschreibung;
          this.accommodations[idx].link = updatedAccommodation.link;
          this.accommodations[idx].name = updatedAccommodation.name;
          this.sharedDataService.changeCurrentAccommodation(
            updatedAccommodation
          );
        },
        error: () => this.error(),
        complete: () => this.success(),
      });
    }
    this.isModalValid = false;
  }

  accommodationDetails(accommodation: Accommodation, dialogForm: any) {
    this.accommodationService.getOne(accommodation.id).subscribe({
      next: (response) => {
        this.accommodationForm = response;
        this.attachedImages = [];
        this.accommodationForm.bilder.forEach((element) => {
          let objectURLHigh = 'data:image/png;base64,' + element;
          this.attachedImages.push(
            this.sanitizer.bypassSecurityTrustUrl(objectURLHigh)
          );
        });
      },
      error: () =>
        this.toastrService.error(
          'Die Informationen konnten nicht geladet werden'
        ),
      complete: () => this.dialog.open(dialogForm, this.dialogConfig),
    });
  }

  editAccommodation(accommodation: Accommodation, dialogForm: any) {
    this.isAdd = false;
    this.sharedDataService.isAddBtnClicked = false;
    this.accommodationService.getOne(accommodation.id).subscribe({
      next: (response) => {
        this.sharedDataService.changeCurrentAccommodation(response);
      },
      error: () => {
        this.toastrService.error(
          'Die Informationen konnten nicht geladet werden'
        );
      },
      complete: () => this.dialog.open(dialogForm, this.dialogConfig),
    });
  }

  deleteAccommodationDialog(accommodation: Accommodation, dialogForm: any) {
    this.toBeDelected = accommodation;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteAccommodation() {
    this.accommodationService.deleteOne(this.toBeDelected.id).subscribe({
      next: () => {
        const idx = this.accommodations.findIndex(
          (x) => x.id === this.toBeDelected.id
        );
        this.accommodations.splice(idx, 1);
      },
      error: () => this.error(),
      complete: () => this.success(),
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
          const idx = this.countryInfos.findIndex((x) => x.id === savedInfo.id);
          this.countryInfos[idx].titel = savedInfo.titel;
          this.countryInfos[idx].description = savedInfo.description;
          this.sharedDataService.changeCurrentCountryInfo(savedInfo);
        },
        error: () => this.error(),
        complete: () => this.success(),
      });
    }
    this.isModalValid = false;
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
        const index = this.countryInfos.findIndex(
          (x) => x.id === this.toBeDelected.id
        );
        this.countryInfos.splice(index, 1);
      },
      error: () =>
        this.toastrService.error(
          'Diese Information konnte nicht gelöscht werden',
          'Fehler'
        ),
      complete: () =>
        this.toastrService.success(
          `${this.toBeDelected.titel} wurde erfolgreich gelöscht`
        ),
    });
  }

  getDescription(description: string) {
    return description.length > 39
      ? `${description.substring(0, 40)}...`
      : description;
  }

  setValidation(value: boolean) {
    this.isModalValid = value;
  }

  setHeaderColor(color: string) {
    this.headercolor = color;
  }

  setFooterColor(color: string) {
    this.footercolor = color;
  }

  private setcurrentCountryForm(country: Country) {
    this.airportsArray.clear();
    country.flughafen?.forEach((x) => this.airportsArray.add(x));

    this.countryForm.setValue({
      name: country.name,
      // The will be automaticaly added from the airportsArray
      airports: '',
      accommodation_text: country.unterkunft_text,
      image: country.karte_bild,
    });

    this.footercolor = country.bodyFarbe;
    this.headercolor = country.headerFarbe;
  }

  private onFormValuesChanged(): void {
    this.countryForm.valueChanges.subscribe({
      next: () => this.isFormValid(),
    });
  }

  private isFormValid(): void {
    if (
      this.countryForm.get('name').valid &&
      this.isImgSelected &&
      this.airportsArray.size > 0 &&
      this.countryForm.get('accommodation_text').valid
    ) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  private success() {
    this.toastrService.success(
      'Die Information wurde erfolgreich gespeichert.'
    );
    this.ngOnInit();
  }

  private error() {
    this.toastrService.error(
      'Die Information konnte nicht geändert werden.',
      'Fehler'
    );
  }
}
