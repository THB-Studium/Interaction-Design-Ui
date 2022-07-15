import {
  Component,
  OnInit,
  Input,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";

import { BookingClassService } from "src/app/services/booking-class/booking-class.service";
import { BookingService } from "src/app/services/booking/booking.service";
import { ToastrService } from "ngx-toastr";

import { Booking } from "src/app/models/booking";
import { BookingState } from "src/app/enums/bookingState";
import { Pattern } from "src/app/variables/pattern";
import { PaymentMethod } from "src/app/enums/paymentMethod";
import { TripOffer } from "src/app/models/tripOffer";
import { ActivatedRoute } from "@angular/router";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";
import { tr } from "date-fns/locale";

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
  isStudent = false;
  isStudentMitReiser = false;
  isMitArbeiter = false;
  isMitArbeiterMitReiser = false;
  panelOpenState = false;
  istAlumReiser= false;
  istAlumMitReiser= false;
  responseAfterBooking = "";

  // Defines selectedFile
  selectedFile?: any;
  fileInputByte: any;
  selectedFileMitReisender?: any;
  fileInputByteMitReisender: any;
  // Defines selectedFileNames
  selectedFileName: string[] = [];
  selectedFileNameMitReisender: string[] = [];
  // Defines isImgSelected
  isImgSelected = false;
  isImgMitReiserSelected = false;

  constructor(
    private bookingclassService: BookingClassService,
    private _formBuilder: FormBuilder,
    private buchungService: BookingService,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private tripofferService: TripOfferService
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

    this.activatedRoute.params.subscribe(param => {

      this.tripofferService.getOne(param.tripofferId).subscribe((trip : TripOffer) => {
        this.currentTripOffer = trip;
        this.bookingclasses = this.currentTripOffer?.buchungsklassenReadListTO;
      });
    });

    this.minDate = new Date(this.currentTripOffer?.startDatum);
    this.maxDate = new Date(this.currentTripOffer?.endDatum);

    this.personenDatenFormGroup = this._formBuilder.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      postanschrift: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.address)])],
      handynummer: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.mobile)])],
      email: ['', Validators.required],
      studiengang: [''],
      status: ['', Validators.required],
      arbeitet: [''],
      schonTeilgennomem: ['', Validators.required],
      hochschule: ['', Validators.required],
      mitMitreiser: ['', Validators.required],
      abFlughafenReisender: [''],
      ruckFlughafenReisender: [''],
      handGepaeckReisender: ['', Validators.required],
      kofferReisender: ['']
    });

    this.personenDatenFormGroupMitReiser = this._formBuilder.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      postanschrift: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.address)])],
      handynummer: ['', Validators.compose([Validators.required, Validators.pattern(Pattern.mobile)])],
      email: ['', Validators.required],
      studiengang: [''],
      status: ['', Validators.required],
      arbeitet: [''],
      schonTeilgennomem: ['', Validators.required],
      hochschule: ['', Validators.required],
      abFlughafenMitReisender: [''],
      ruckFlughafenMitReisender: [''],
      handGepaeckMitReisender: ['', Validators.required],
      kofferMitReisender: ['']
    });

    this.reiseDatenFormGroup = this._formBuilder.group({
      buchungsklasseId: ['', Validators.required],
      datum: ['', Validators.required],
      zahlungsmethod: ['', Validators.required]
    });

    this.agbFormGroup = this._formBuilder.group({
      agb: ['', Validators.requiredTrue],
    });

  }

  getFormValues() {
    this.reisendeArray = [];
    this.reise = this.reiseDatenFormGroup.value;
    this.reise.datum = formatDate(this.reise.datum, "yyyy-MM-dd", "en_US");
    this.reisendeArray.push(this.personenDatenFormGroup.value);
    if(this.mitreiserForm) {
      this.reisendeArray.push(this.personenDatenFormGroupMitReiser.value);
    }
    this.selectedBookingClass = this.getBuchungsKlasse(this.reiseDatenFormGroup.get('buchungsklasseId').value);

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
      buchungsklasseId: this.selectedBookingClass?.id,
      buchungDatum: '',
      handGepaeck: this.reise.handgepaeck === true ? 'true': 'false',
      koffer: this.reise.koffer === true ? 'true': 'false',
      reiseAngebotId: this.currentTripOffer?.id,
      zahlungMethod: this.reise.zahlungsmethod,
      status: BookingState.EINGEGANGEN,

      abFlughafenReisender: reiserForm.abFlughafenReisender,
      ruckFlughafenReisender: reiserForm.ruckFlughafenReisender,
      handGepaeckReisender: reiserForm.handGepaeckReisender,
      kofferReisender: reiserForm.kofferReisender,

      abFlughafenMitReisender: mitReiserForm.abFlughafenMitReisender,
      ruckFlughafenMitReisender: mitReiserForm.ruckFlughafenMitReisender,
      handGepaeckMitReisender: mitReiserForm.handGepaeckMitReisender,
      kofferMitReisender: mitReiserForm.kofferMitReisender,

      reisender: {
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
        status: reiserForm.status,
        identityCard: this.fileInputByte
      },

      mitReisender: this.mitreiserForm ? {
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
        status: mitReiserForm.status,
        identityCard: this.fileInputByteMitReisender
      } : null,
      // todo
      buchungsnummer: '',
      hinFlugDatum: this.reise.datum,
      ruckFlugDatum: this.reise.datum
    }

    this.buchungService.addOne(buchungsObjekt).subscribe({
      next: (resp) => {
        this.canDownloadPdf = true;
        this.currentBookingId = resp.id;

      },
      complete: () => {
        this.toaster.success('erfolgreich gebucht', 'Erfolgreich');
        this.responseAfterBooking = "Die Reise wurde erfolgreich gebucht";
      },
      error: (error) => {
        this.toaster.error('Die Buchung konnte nicht durchgeführt werden', 'Fehler');
        this.responseAfterBooking = "Die Buchung konnte nicht durchgeführt werden";
      }
    });
  }

  downloadPdf() {
    this.buchungService.exportPdf(this.currentBookingId);
  }

   // On file selected
  selectFile(event: any): void {

    this.selectedFileName = [];
    this.selectedFile = event.target.files;

    if (this.selectedFile && this.selectedFile.item(0)) {

      this.selectedFileName.push(this.selectedFile.item(0).name);

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileInputByte = reader.result;
      };

      this.isImgSelected = true;
    } else {
      this.isImgSelected = false;
    }
  }

  selectFileMitReisender(event_: any): void {
    this.selectedFileNameMitReisender = [];
    this.selectedFileMitReisender = event_.target.files;
    if (this.selectedFileMitReisender && this.selectedFileMitReisender.item(0)) {

      this.selectedFileNameMitReisender.push(this.selectedFileMitReisender.item(0).name);

      const file = event_.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileInputByteMitReisender = reader.result;
      };

      this.isImgMitReiserSelected = true;
    } else {
      this.isImgMitReiserSelected = false;
    }
  }

}
