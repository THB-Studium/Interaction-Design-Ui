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

import { BookingClass } from "src/app/models/bookingClass";

@Component({
  selector: "app-bookingclass-form",
  templateUrl: "./bookingclass-form.component.html",
  styleUrls: ["./bookingclass-form.component.css"],
})
export class BookingclassFormComponent implements OnInit, AfterViewInit {
  // Defines notifyFormIsValid. Notify the parent when the form is valid
  @Output() notifyFormIsValid = new EventEmitter<boolean>(false);

  // Defines bookingclassForm
  bookingclassForm = new FormGroup({
    // title
    title: new FormControl("", [Validators.required]),
    // description
    description: new FormControl("", [Validators.required]),
    // price
    price: new FormControl("", [Validators.required]),
  });

  // Defines currentBookingclass.
  currentBookingclass: BookingClass;
  // Defines currentBookingclassId.
  currentBookingclassId: string = "";
  // Defines currentTripofferId
  currentTripofferId = "";
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
      this.sharedDataService.currentBookingclass
        .subscribe({
          next: (bookinclass) => {
            this.currentBookingclass = bookinclass;
            this.setFormDefaultValue(this.currentBookingclass);
            this.currentBookingclassId = this.currentBookingclass.id;
            this.currentTripofferId = this.currentBookingclass.reiseAngebotId;
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

  private setFormDefaultValue(bookinclass: BookingClass): void {
    this.bookingclassForm.setValue({
      title: bookinclass.type,
      description: bookinclass.description? bookinclass.description:"",
      price: bookinclass.preis.toString(),
    });
  }

  private onFormValuesChanged(): void {
    this.bookingclassForm.valueChanges.subscribe({
      next: () => {
        var id = null;
        if (!this.isAnAdd) {
          id = this.currentBookingclassId;
        }

        this.currentBookingclass = {
          id: id,
          type: this.bookingclassForm.get("title").value,
          description: this.bookingclassForm.get("description").value,
          preis: +this.bookingclassForm.get("price").value,
          reiseAngebotId: this.currentTripofferId,
        };
        // check whether the form is valid or not
        this.isFormValid();
      },
    });
  }

  private isFormValid(): void {
    if (
      this.bookingclassForm.get("title").valid &&
      this.bookingclassForm.get("description").valid &&
      this.bookingclassForm.get("price").valid
    ) {
      this.sharedDataService.changeCurrentBookinclass(this.currentBookingclass);
      // notify the parent
      this.notifyFormIsValid.emit(true);
    } else {
      this.notifyFormIsValid.emit(false);
    }
  }
}
