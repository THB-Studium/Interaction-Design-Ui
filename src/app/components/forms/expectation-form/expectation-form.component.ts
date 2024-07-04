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

import { Expectation } from "src/app/models/expectation";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
    selector: "app-expectation-form",
    templateUrl: "./expectation-form.component.html",
    styleUrls: ["./expectation-form.component.css"],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
    ],
})
export class ExpectationFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  expectationForm = new FormGroup({
    adventure: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ]),
    comfort: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ]),
    deceleration: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ]),
    road: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ]),
    safety: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ]),
    sun_beach: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ]),
    sustainability: new FormControl("", [
      Validators.min(0),
      Validators.max(100),
    ])
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
      adventure: expectation.abenteuer.toString(),
      comfort: expectation.konfort.toString(),
      deceleration: expectation.entschleunigung.toString(),
      road: expectation.road.toString(),
      safety: expectation.sicherheit.toString(),
      sun_beach: expectation.sonne_strand.toString(),
      sustainability: expectation.nachhaltigkeit.toString()
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
          abenteuer: +this.expectationForm.get("adventure").value,
          konfort: +this.expectationForm.get("comfort").value,
          entschleunigung: +this.expectationForm.get("deceleration").value,
          road: +this.expectationForm.get("road").value,
          sicherheit: +this.expectationForm.get("safety").value,
          sonne_strand: +this.expectationForm.get("sun_beach").value,
          nachhaltigkeit: +this.expectationForm.get("sustainability").value,
          reiseAngebotId: this.currentReiseAngebotId,
        };
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.expectationForm.get("adventure").valid ||
      this.expectationForm.get("comfort").valid ||
      this.expectationForm.get("deceleration").valid ||
      this.expectationForm.get("road").valid ||
      this.expectationForm.get("safety").valid ||
      this.expectationForm.get("sun_beach").valid ||
      this.expectationForm.get("sustainability").valid
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
