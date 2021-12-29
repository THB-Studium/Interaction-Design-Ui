import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from 'rxjs';

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";

import { Accommodation } from "src/app/models/accommodation";

@Component({
  selector: 'app-accommodation-form',
  templateUrl: './accommodation-form.component.html',
  styleUrls: ['./accommodation-form.component.css']
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
    images: new FormControl("Bilder auswählen", [Validators.required])
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
      this.sharedDataService.currentAccommodation.subscribe({
        next: (accommodation) => {
          this.currentAccommodation = accommodation;
          this.setFormDefaultValue(accommodation);
          this.currentAccommodationId = accommodation.id;
          this.currentcountryId = accommodation.landId
        },
        error: () => {
          this.toastrService.error(
            `Die Unterkünfte konnten nicht geladen werden.`,
            "Fehler"
          );
        }
      }).unsubscribe();
    }
  }

  private setFormDefaultValue(accommodation: Accommodation): void {
    this.accommodationForm.setValue({
      name: accommodation.name,
      address: accommodation.addresse,
      web: accommodation.link,
      description: accommodation.beschreibung
    });
  }

  private onFormValuesChanged(): void {
    this.accommodationForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentAccommodationId;
        }

        this.currentAccommodation = {
          id: id,
          name: this.accommodationForm.get("name").value,
          addresse: this.accommodationForm.get('address').value,
          link: this.accommodationForm.get('web').value,
          beschreibung: this.accommodationForm.get("description").value,
          bilder: this.uploadedImges,
          landId: this.currentcountryId
        }
        // check whether the form is valid or not
        this.isFormValid();
      }
    });
  }

  private isFormValid(): void {
    if (this.accommodationForm.get("name").valid &&
        this.accommodationForm.get("description").valid &&
        this.accommodationForm.get("address").valid &&
        this.accommodationForm.get("web").valid && this.isImgSelected) {
      // change the value of the accommodation into the service
      this.sharedDataService.changeCurrentAccommodation(this.currentAccommodation);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    }
    else {
      this.notifyFormIsValid.emit(false);
    }
  }

  // On files selected
  selectFiles(event: any): void {
    this.uploadedImges = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      this.isImgSelected = true;
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFiles.item(i));
        this.selectedFileNames.push(this.selectedFiles.item(i).name);
         // convert it to byte array
         reader.addEventListener("loadend", () => {
          const bytearray = this.convertDataURIToBinary(reader.result);
          // set the current images
          this.uploadedImges.push(bytearray);
        });
      }
      // convert to byte array
      /*for (let i = 0; i < this.selectedFiles.length; i++) {
        this.convertToByteArray(this.selectedFiles.item(i));
        
      }*/
      // set the current images
      this.currentAccommodation.bilder = this.uploadedImges;
    }
    else {
      this.isImgSelected = false;
    }
    // check whether the form is valid or not
    this.isFormValid();
  }

  // Convert file to byte array
  private convertToByteArray(file: File): void {
    if (file) {
      var buffer = file.arrayBuffer();
      buffer.then(value => {
        let bytearray = new Uint8Array(value.byteLength);
        this.uploadedImges.push(bytearray);
      });
    }
  }

  convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(";base64,") + ";base64,".length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

}
