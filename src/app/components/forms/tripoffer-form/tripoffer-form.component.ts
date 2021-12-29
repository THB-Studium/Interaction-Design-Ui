import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";

import { FormControl, FormGroup, Validators } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { TripOffer } from "src/app/models/tripOffer";

@Component({
  selector: "app-tripoffer-form",
  templateUrl: "./tripoffer-form.component.html",
  styleUrls: ["./tripoffer-form.component.css"],
})
export class TripofferFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines tripofferForm
  tripofferForm = new FormGroup({
    // title
    title: new FormControl("", [Validators.required]),
    // image
    image: new FormControl("", [Validators.required]),
    // startdate
    startdate: new FormControl(new Date(), [Validators.required]),
    // enddate
    enddate: new FormControl(new Date(), [Validators.required]),
    // deadline
    deadline: new FormControl(new Date(), [Validators.required]),
    // totalplace
    totalplace: new FormControl("", [Validators.required]),
    // services
    services: new FormControl("", [Validators.required]),
    // authorizedtotravel
    authorizedtotravel: new FormControl("", [Validators.required]),
    // notes
    notes: new FormControl("", [Validators.required]),
  });

  // Defines serviceArray
  serviceArray = new Set([]);
  // Defines authorizedtotravelArray
  authorizedtotravelArray = new Set([]);
  // Defines notesArray
  notesArray = new Set([]);

  // Defines isAnAdd
  isAnAdd = false;
  // Defines isValid
  isValid = false;
  // Defines currentTripoffer
  currentTripoffer: TripOffer;
  // Defines currentTripofferId
  currentTripofferId: string;

  constructor(private sharedDataService: SharedDataService) {}

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
      this.sharedDataService.currenttripOfferSource
        .subscribe({
          next: (currentTripoffer) => {
            this.currentTripoffer = currentTripoffer;
            this.setcurrentTripofferForm(currentTripoffer);
            this.currentTripofferId = currentTripoffer.id;
          },
        })
        .unsubscribe();
    }
  }

  private setcurrentTripofferForm(tripoffer: TripOffer) {
    // service array
    this.serviceArray.clear();
    tripoffer.leistungen.forEach((value) => this.serviceArray.add(value));
    // authorization array
    this.authorizedtotravelArray.clear();
    tripoffer.mitreiseberechtigt.forEach((value) =>
      this.authorizedtotravelArray.add(value)
    );
    // note array
    this.notesArray.clear();
    tripoffer.hinweise.forEach((value) => this.notesArray.add(value));

    this.tripofferForm.setValue({
      title: tripoffer.titel,
      startdate: tripoffer.startDatum,
      enddate: tripoffer.endDatum,
      deadline: tripoffer.anmeldungsFrist,
      totalplace: tripoffer.plaetze,
      services: this.serviceArray,
      authorizedtotravel: this.authorizedtotravelArray,
      notes: this.notesArray,
    });
  }

  // Adds new selected service into the list of services
  addServiceFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.serviceArray.add(event.value);
      event.chipInput!.clear();
    }
    // check whether the form is valid or not
    this.isFormValid();
  }

  // Removes selected from the list of services
  removeService(service: string) {
    this.serviceArray.delete(service);
    // check whether the form is valid or not
    this.isFormValid();
  }

  private onFormValuesChanged(): void {
    this.tripofferForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentTripofferId;
        }

        this.currentTripoffer = {
          id: id,
          startbild: this.tripofferForm.get("image").value,
          titel: this.tripofferForm.get("title").value,
          startDatum: this.tripofferForm.get("startdate").value,
          endDatum: this.tripofferForm.get("enddate").value,
          anmeldungsFrist: this.tripofferForm.get("deadline").value,
          plaetze: this.tripofferForm.get("totalplace").value,
          freiPlaetze: this.tripofferForm.get("totalplace").value,
          interessiert: 0,
          leistungen: Array.from(this.serviceArray),
          mitreiseberechtigt: Array.from(this.authorizedtotravelArray),
          hinweise: Array.from(this.notesArray),
          erwartungenReadListTO: null,
          landId: null,
          buchungsklassenReadListTO: null,
        };
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.tripofferForm.get("title").valid &&
      this.tripofferForm.get("startdate").valid &&
      this.serviceArray.size > 0
    ) {
      this.sharedDataService.changeCurrentTripOffer(this.currentTripoffer);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }
}
