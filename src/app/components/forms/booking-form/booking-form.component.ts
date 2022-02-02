import {
  Component,
  OnInit,
  Input,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { formatDate } from "@angular/common";

import { ToastrService } from "ngx-toastr";
import { BookingClassService } from "src/app/services/booking-class/booking-class.service";

import { Booking } from "src/app/models/booking";
import { TripOffer } from "src/app/models/tripOffer";

import { PaymentMethod } from "src/app/enums/paymentMethod";
import { BookingService } from "src/app/services/booking/booking.service";
import { MatDialog } from "@angular/material/dialog";
import { Pattern } from "src/app/variables/pattern";

@Component({
  selector: "app-booking-form",
  templateUrl: "./booking-form.component.html",
  styleUrls: ["./booking-form.component.css"],
})
export class BookingFormComponent implements OnInit {

  /** list of tripoffers */
  protected tripoffers: TripOffer[];

  isLinear = false;
  personenDatenFormGroup: FormGroup;
  personenDatenFormGroupMitReiser: FormGroup;
  reiseDatenFormGroup: FormGroup;
  agbFormGroup: FormGroup;
  fazitFormGroup: FormGroup;

  @Input()
  land: any;

  @Input()
  currentTripOffer: TripOffer;

  mitreiserForm = false;

  bookingclasses: any[];

  reseinde: any;
  reisendeArray: any[] = [];

  reise: any;
  reiseArray: any[] = [];

  selectedBookingClass: any;
  paymentMethodArray: PaymentMethod[];

  minDate: Date;
  maxDate: Date;
  canDownloadPdf = false;
  currentBookingId: any;

  constructor(
    private bookingclassService: BookingClassService,
    private _formBuilder: FormBuilder,
    private buchungService: BookingService,
    private toaster: ToastrService,
    private dialog: MatDialog,
  ) {

    this.paymentMethodArray = [
      PaymentMethod.EINMAL,
      PaymentMethod.GUTHABEN,
      PaymentMethod.GUTSCHEIN,
      PaymentMethod.RATENZAHLUNG,
      PaymentMethod.ANZAHLUNG_150,
    ];
  }

  ngOnInit(): void {

    this.minDate = new Date(this.currentTripOffer.startDatum);
    this.maxDate = new Date(this.currentTripOffer.endDatum);

    this.personenDatenFormGroup = this._formBuilder.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      postanschrift: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.street)])],
      handynummer: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.mobile)])],
      email: ['', Validators.required],
      studiengang: ['', Validators.required],
      status: ['', Validators.required],
      arbeitet: ['', Validators.required],
      schonTeilgennomem: ['', Validators.required],
      hochschule: ['', Validators.required],
      mitMitreiser: ['', Validators.required],
    });

    this.personenDatenFormGroupMitReiser = this._formBuilder.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      postanschrift: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.street)])],
      handynummer: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.mobile)])],
      email: ['', Validators.required],
      studiengang: ['', Validators.required],
      status: ['', Validators.required],
      arbeitet: ['', Validators.required],
      schonTeilgennomem: ['', Validators.required],
      hochschule: ['', Validators.required],
    });

    this.reiseDatenFormGroup = this._formBuilder.group({
      buchungsklasseId: ['', Validators.required],
      datum: ['', Validators.required],
      flughafen: ['', Validators.required],
      handgepaeck: ['', Validators.required],
      zahlungsmethod: ['', Validators.required],
      koffer: ['', Validators.required],
    });

    this.agbFormGroup = this._formBuilder.group({
      agb: ['', Validators.requiredTrue],
    });

    this.bookingclasses = this.currentTripOffer.buchungsklassenReadListTO;
  }

  getFormValues() {
    this.reisendeArray = [];
    this.reise = this.reiseDatenFormGroup.value;
    this.reise.datum = formatDate(this.reise.datum, "yyyy-MM-dd", "en_US");
    this.reisendeArray.push(this.personenDatenFormGroup.value);
    if(this.mitreiserForm) {
      this.reisendeArray.push(this.personenDatenFormGroupMitReiser.value);
    }
    this.selectedBookingClass =this.getBuchungsKlasse(this.reiseDatenFormGroup.get('buchungsklasseId').value);

    this.reisendeArray = this.reisendeArray.map((reiser) => {
      reiser.geburtsdatum = formatDate(reiser.geburtsdatum, "yyyy-MM-dd", "en_US");
      reiser.schonTeilgennomem = this.personenDatenFormGroup.get('schonTeilgennomem').value == 'true' ? true : false;
      return reiser;
    });

  }

  getBuchungsKlasse(id: string): any {
    this.bookingclassService.getOne(id).subscribe({
      next: (resp) => {
        this.selectedBookingClass = resp;
      }
    });
  }

  setFormMitReiser(choice: boolean) {
    this.mitreiserForm = choice;
  }

  buchen() {

    let reiserForm = this.personenDatenFormGroup.value;
    let mitReiserForm = this.personenDatenFormGroupMitReiser.value;

    let buchungsObjekt: Booking = {
      id: null,
      buchungsklasseId: this.selectedBookingClass.id,
      datum: this.reise.datum,
      flughafen: this.reise.flughafen,
      handGepaeck: this.reise.handgepaeck,
      koffer: this.reise.koffer,
      reiseAngebotId: this.currentTripOffer.id,
      zahlungMethod: this.reise.zahlungsmethod,

      reiser: {
        id: null,
        adresse: reiserForm.postanschrift,
        arbeitBei: reiserForm.arbeitet,
        email: reiserForm.email,
        geburtsdatum: reiserForm.geburtsdatum,
        hochschule: reiserForm.hochschule,
        name: reiserForm.nachname,
        vorname: reiserForm.vorname,
        schonTeilgenommen: reiserForm.schonTeilgennomem,
        studiengang: reiserForm.studiengang,
        telefonnummer: reiserForm.handynummer,
        status: reiserForm.status
      },

      mitReiser: this.mitreiserForm ? {
        id: null,
        adresse: mitReiserForm.postanschrift,
        arbeitBei: mitReiserForm.arbeitet,
        email: mitReiserForm.email,
        geburtsdatum: mitReiserForm.geburtsdatum,
        hochschule: mitReiserForm.hochschule,
        name: mitReiserForm.nachname,
        vorname: mitReiserForm.vorname,
        schonTeilgenommen: mitReiserForm.schonTeilgennomem,
        studiengang: mitReiserForm.studiengang,
        telefonnummer: mitReiserForm.handynummer,
        status: mitReiserForm.status
      } : null
    }

    console.log(buchungsObjekt);

    this.buchungService.addOne(buchungsObjekt).subscribe({
      next: (resp) => {
        console.log(resp);
        this.canDownloadPdf = true;
        this.currentBookingId = resp.id;

      },
      complete: () => {
        this.toaster.success('erfolgreich gebucht', 'Erfolgreich');
        //this.dialog.closeAll();
      },
      error: (error) => {
        console.log(error)
        this.toaster.error('Die Buchung konnte nicht durchgeführt werden', 'Fehler');
      }
    });
  }

  downloadPdf() {
    this.buchungService.exportPdf(this.currentBookingId);
  }

}
