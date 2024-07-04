import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";

import { CountryInformation } from "src/app/models/countryInformation";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
    selector: 'app-country-information-form',
    templateUrl: './country-information-form.component.html',
    styleUrls: ['./country-information-form.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf]
})
export class CountryInformationFormComponent implements OnInit, AfterViewInit {

  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines countryInfoForm
  countryInfoForm = new FormGroup({
    // title
    title: new FormControl("", [Validators.required]),
    // description
    description: new FormControl("", [Validators.required])
  });

  // Defines currentCountryInfo. Contains complet current country-info information.
  currentCountryInfo: CountryInformation;
  // Defines currentCountryInfoId. Contains the id of the current country-info. Helpfull to handle an edit process.
  currentCountryInfoId: string = "";
  // Defines currentcountryId
  currentcountryId = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAnAdd: boolean = true;

  constructor(
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
  }

  private initForm(): void {
    this.isAnAdd = this.sharedDataService.isAddBtnClicked;
    // If it is not an add
    if (!this.isAnAdd) {
      this.sharedDataService.currentCountryInfo.subscribe({
        next: (curCountryInfo) => {
          this.currentCountryInfo = curCountryInfo;
          this.setFormDefaultValue(curCountryInfo);
          this.currentCountryInfoId = curCountryInfo.id;
          this.currentcountryId = curCountryInfo.landId
        },
        error: () => {
          this.toastrService.error(
            `Die daten konnte nicht geladen werden.`,
            "Fehler"
          );
        }
      }).unsubscribe();
    }
  }

  private setFormDefaultValue(countryInfo: CountryInformation): void {
    this.countryInfoForm.setValue({
      title: countryInfo.titel,
      description: countryInfo.description
    });
  }

  private onFormValuesChanged(): void {
    this.countryInfoForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentCountryInfoId;
        }

        this.currentCountryInfo = {
          id: id,
          titel: this.countryInfoForm.get("title").value,
          description: this.countryInfoForm.get("description").value,
          landId: this.currentcountryId
        }
        // check whether the form is valid or not
        this.isFormValid();
      }
    });
  }

  private isFormValid(): void {
    if (this.countryInfoForm.get("title").valid &&
        this.countryInfoForm.get("description").valid) {
      // change the value of the country-info into the service
      this.sharedDataService.changeCurrentCountryInfo(this.currentCountryInfo);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    }
    else {
      this.notifyFormIsValid.emit(false);
    }
  }
}
