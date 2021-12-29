import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";

import { Highlight } from "src/app/models/highlight";

@Component({
  selector: "app-highlight-form",
  templateUrl: "./highlight-form.component.html",
  styleUrls: ["./highlight-form.component.css"],
})
export class HighlightFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines highlightForm
  highlightForm = new FormGroup({
    // name
    name: new FormControl("", [Validators.required]),
    // description
    description: new FormControl("", [Validators.required]),
    // img
    img: new FormControl("Bild auswählen", [Validators.required]),
  });

  // Defines currentHighlight.
  currentHighlight: Highlight;
  // Defines currentHighlightId.
  currentHighlightId: string = "";
  // Defines currentcountryId
  currentcountryId = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAnAdd: boolean = true;
  // Defines selectedFile
  selectedFile?: FileList;
  // Defines selectedFileNames
  selectedFileName: string[] = [];
  // Defines uploadedImages
  uploadedImge = [];
  // Defines isImgSelected
  isImgSelected = false;

  constructor(
    private sharedDataService: SharedDataService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
  }

  initForm() {
    this.isAnAdd = this.sharedDataService.isAddBtnClicked;
    // If it is not an add
    if (!this.isAnAdd) {
      this.sharedDataService.currentHighlight
        .subscribe({
          next: (highlight) => {
            this.currentHighlight = highlight;
            this.setFormDefaultValue(highlight);
            this.currentHighlightId = highlight.id;
            //this.currentcountryId = highlight.landId;
          },
          error: () => {
            this.toastrService.error(
              `Die daten konnte nicht geladen werden.`,
              "Fehler"
            );
          },
        })
        .unsubscribe();
    }
  }

  setFormDefaultValue(highlight: Highlight) {
    this.highlightForm.setValue({
      name: highlight.name,
      desccription: highlight.description,
      img: highlight.bild,
    });
  }

  onFormValuesChanged() {
    this.highlightForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentHighlightId;
        }

        this.currentHighlight = {
          id: id,
          name: this.highlightForm.get("name").value,
          description: this.highlightForm.get("description").value,
          bild: null,
          landId: this.currentcountryId,
        };
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  isFormValid() {
    if (
      this.highlightForm.get("name").valid &&
      this.highlightForm.get("description").valid &&
      this.isImgSelected
    ) {
      // change the value of the value into the service
      this.sharedDataService.changeCurrentHighlight(this.currentHighlight);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }

  // On file selected
  selectFile(event: any): void {
    this.uploadedImge = [];
    this.selectedFileName = [];
    this.selectedFile = event.target.files;
    this.currentHighlight.bild = this.selectedFile[0];
    this.isImgSelected = true;
    this.isFormValid();
    return;
    if (this.selectedFile && this.selectedFile[0]) {
      this.isImgSelected = true;
      const numberOfFiles = this.selectedFile.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile.item(i));
        // display image name
        this.selectedFileName.push(this.selectedFile.item(i).name);
        // convert it to byte array
        reader.addEventListener("loadend", () => {
          const bytearray = this.convertDataURIToBinary(reader.result);
          // set the current images
          this.currentHighlight.bild = bytearray;
        });
      }
      // convert to byte array
      /*for (let i = 0; i < this.selectedFile.length; i++) {
        this.convertToByteArray(this.selectedFile.item(i));
      }
      // set the current images
      this.currentHighlight.bild = this.uploadedImge;*/
    } else {
      this.isImgSelected = false;
    }
    // check whether the form is valid or not
    this.isFormValid();
  }

  // Convert file to byte array
  private convertToByteArray(file: File): void {
    if (file) {
      var buffer = file.arrayBuffer();
      buffer.then((value) => {
        let bytearray = new Uint8Array(value.byteLength);
        this.uploadedImge.push(bytearray);
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
