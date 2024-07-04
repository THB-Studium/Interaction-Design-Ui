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

import { Accommodation } from "src/app/models/accommodation";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
    selector: "app-accommodation-form",
    templateUrl: "./accommodation-form.component.html",
    styleUrls: ["./accommodation-form.component.css"],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        MatToolbarModule,
    ],
})
export class AccommodationFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid.
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines accommodationForm
  accommodationForm = new FormGroup({
    // name
    name: new FormControl("", [Validators.required]),
    // address
    address: new FormControl("", [Validators.required]),
    // web
    web: new FormControl(""),
    // description
    description: new FormControl("", [Validators.required]),
    // images
    images: new FormControl("Bilder auswählen", [Validators.required]),
  });

  // Defines currentAccommodation
  currentAccommodation: Accommodation;
  // Defines currentAccommodationId.
  currentAccommodationId: string = "";
  // Defines currentcountryId
  currentcountryId: string = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAnAdd: boolean = true;
  // Defines selectedFiles
  selectedFiles?: FileList;
  // Defines selectedFileNames
  selectedFileNames: string[] = [];
  // Defines uploadedImages
  uploadedImges = [];
  // Defines isImgSelected
  isImgSelected = false;

  constructor(
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService
  ) {
    this.currentAccommodation = {
      adresse: "",
      beschreibung: "",
      bilder: [],
      id: null,
      landId: null,
      link: "",
      name: "",
    };
  }

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
      this.isImgSelected = true;
      this.sharedDataService.currentAccommodation
        .subscribe({
          next: (accommodation) => {
            this.currentAccommodation = accommodation;
            this.setFormDefaultValue(accommodation);
            this.currentAccommodationId = accommodation.id;
            this.currentcountryId = accommodation.landId;
          },
          error: () => {
            this.toastrService.error(
              `Die Unterkünfte konnten nicht geladen werden.`,
              "Fehler"
            );
          },
        })
        .unsubscribe();
    }
  }

  private setFormDefaultValue(accommodation: Accommodation): void {
    this.accommodationForm.setValue({
      name: accommodation.name,
      address: accommodation.adresse,
      web: accommodation.link,
      description: accommodation.beschreibung,
      images: "",
    });
  }

  private onFormValuesChanged(): void {
    this.accommodationForm.valueChanges.subscribe({
      next: () => {
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.accommodationForm.get("name").valid &&
      this.accommodationForm.get("description").valid &&
      this.accommodationForm.get("address").valid &&
      this.accommodationForm.get("web").valid &&
      this.isImgSelected
    ) {
      var id = null;
      if (!this.isAnAdd) {
        id = this.currentAccommodationId;
      }

      this.currentAccommodation = {
        id: id,
        name: this.accommodationForm.get("name").value,
        adresse: this.accommodationForm.get("address").value,
        link: this.accommodationForm.get("web").value,
        beschreibung: this.accommodationForm.get("description").value,
        bilder: this.uploadedImges,
        landId: this.currentcountryId,
      };
      // change the value of the accommodation into the service
      this.sharedDataService.changeCurrentAccommodation(
        this.currentAccommodation
      );
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }

  // On files selected
  selectFiles(event: any): void {
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      this.uploadedImges = [];
      for (let i = 0; i < numberOfFiles; i++) {
        this.selectedFileNames.push(this.selectedFiles.item(i).name);
        const file = this.selectedFiles.item(i);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.uploadedImges.push(reader.result);
        };
      }
      this.accommodationForm.get("images").setErrors(null);
      this.isImgSelected = true;
    } else {
      this.isImgSelected = false;
      this.accommodationForm.get("images").setErrors({ valid: true });
    }
    // check whether the form is valid or not
    this.isFormValid();
  }
}
