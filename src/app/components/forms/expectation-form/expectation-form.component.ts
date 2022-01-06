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

import { Expectation } from "src/app/models/expectation";

@Component({
  selector: "app-expectation-form",
  templateUrl: "./expectation-form.component.html",
  styleUrls: ["./expectation-form.component.css"],
})
export class ExpectationFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  expectationForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
    value: new FormControl("", [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
  });

  // Defines currentExpectation
  currentExpectation: Expectation;
  // Defines currentExpectationId.
  currentExpectationId: string = "";
  // Defines currentReiseAngebotId
  currentReiseAngebotId = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAnAdd: boolean = true;

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

  private initForm(): void {
    this.isAnAdd = this.sharedDataService.isAddBtnClicked;
    // If it is not an add
    if (!this.isAnAdd) {
      this.sharedDataService.currentExpectation
        .subscribe({
          next: (expectation) => {
            this.currentExpectation = expectation;
            this.setFormDefaultValue(this.currentExpectation);
            this.currentExpectationId = this.currentExpectation.id;
            this.currentReiseAngebotId = this.currentExpectation.reiseAngebotId;
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

  private setFormDefaultValue(expectation: Expectation): void {
    this.expectationForm.setValue({
      text: expectation.text? expectation.text: "",
      value: expectation.wert,
    });
  }

  private onFormValuesChanged(): void {
    this.expectationForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentExpectationId;
        }

        this.currentExpectation = {
          id: id,
          text: this.expectationForm.get("text").value,
          wert: this.expectationForm.get("value").value,
          reiseAngebotId: this.currentReiseAngebotId,
        };
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.expectationForm.get("text").valid &&
      this.expectationForm.get("value").valid
    ) {
      // change the value of the expectation into the service
      this.sharedDataService.changeCurrentExpectation(this.currentExpectation);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }
}
