import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { ActivatedRoute } from "@angular/router";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Country } from "src/app/models/country";
import { CountryService } from "src/app/services/country/country.service";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from "@angular/platform-browser";

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
    accommodation_text: new FormControl("", [Validators.required]),
    // image
    image: new FormControl(""),
  });

  // Defines currentCountry. Contains complet current country information.
  currentCountry: Country;
  // Defines currentCountryId. Contains the id of the current country. Helpfull to handle an edit process.
  currentCountryId: string = "";
  // Defines airportsArray
  airportsArray = new Set([]);
  // Defines isImgSelected
  isImgSelected = false;
  // Defines selectedFileName
  selectedFileName: string;
  // Defines selectedFile
  selectedFile?: any;
  fileInputByte: any;
  // Defines isAnAdd
  isAnAdd = false;
  // Defines isValid
  isValid = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private countryService: CountryService,
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.currentCountry = {
      id: null,
      name: "",
      flughafen: [],
      unterkunft_text: "",
      karte_bild: null,
      highlights: [],
      landInfo: [],
      unterkunft: [],
    };
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
  }

  private initForm() {
    this.activatedRoute.params.subscribe((param) => {
      if (param.id) {
        // it is an edit
        this.countryService.getOne(param.id).subscribe({
          next: (country) => {
            //convert image
            let objectURL = "data:image/png;base64," + country.karte_bild;
            country.realImage =
              this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.currentCountry = country;
          },
          error: () =>
            this.toastrService.error(
              "Die Daten konnten nicht geladen werden",
              "Fehler"
            ),
          complete: () => this.setCountryForm(this.currentCountry),
        });
      } else {
        this.currentCountry = null;
      }
    });
  }

  private setCountryForm(country: Country) {
    this.airportsArray.clear();
    country.flughafen?.forEach((value) => this.airportsArray.add(value));

    this.countryForm.setValue({
      name: country.name,
      accommodation_text: country.unterkunft_text,
      airports: [],
      // Todo: convert image and add his name to this input
      image: "",
    });
    // Since there is already an attached image, set the img selected to true
    this.isImgSelected = true;
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
    let name = [];
    this.selectedFile = event.target.files;
    if (this.selectedFile && this.selectedFile.item(0)) {
      this.isImgSelected = true;
      // set the value of the input
      name.push(this.selectedFile.item(0).name);
      //this.countryForm.value.image = name[0];
      // check whether the form is valid or not
      this.isFormValid();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileInputByte = reader.result;
      };
      this.selectedFileName = name[0];
      this.countryForm.get("image").setErrors(null);
    } else {
      this.isImgSelected = false;
      this.countryForm.get("image").setErrors({ valid: false });
    }
  }

  private onFormValuesChanged(): void {
    this.countryForm.valueChanges.subscribe({
      next: () => this.isFormValid(),
    });
  }

  private isFormValid(): void {
    if (
      this.countryForm.get("name").valid &&
      this.isImgSelected &&
      this.airportsArray.size > 0 &&
      this.countryForm.get("accommodation_text").valid
    ) {
      var id = null;
      if (!this.isAnAdd) {
        id = this.currentCountryId;
      }

      this.currentCountry = {
        id: id,
        name: this.countryForm.get("name").value,
        flughafen: Array.from(this.airportsArray),
        unterkunft_text: this.countryForm.get("accommodation_text").value,
        karte_bild: this.fileInputByte,
        highlights: this.currentCountry.highlights
          ? this.currentCountry.highlights
          : [],
        landInfo: this.currentCountry.landInfo
          ? this.currentCountry.landInfo
          : [],
        unterkunft: this.currentCountry.unterkunft
          ? this.currentCountry.unterkunft
          : [],
      };

      this.sharedDataService.changeCurrentCountry(this.currentCountry);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }
}
