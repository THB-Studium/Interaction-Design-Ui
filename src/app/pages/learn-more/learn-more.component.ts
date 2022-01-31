import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { CountriesColors } from "../../shared/datas/countries-colors";
import { SharedDataService } from "../../services/sharedData/shared-data.service";
import { Highlights } from "../../shared/datas/highlights";
import { MatDialog } from '@angular/material/dialog';
import { BookingFormComponent } from 'src/app/components/forms/booking-form/booking-form.component';
import { BookingClassen } from "../../shared/datas/bookingClassen";
import { BookingClass } from "../../models/bookingClass";
import { TripOfferService } from 'src/app/services/trip-offer/trip-offer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CountryService } from 'src/app/services/country/country.service';
import { TripOffer } from "../../models/tripOffer";
import { MatTableDataSource } from "@angular/material/table";
import { Country } from "../../models/country";

@Component({
  selector: 'app-learn-more',
  templateUrl: './learn-more.component.html',
  styleUrls: ['./learn-more.component.css']
})
export class LearnMoreComponent implements OnInit {
  countries: Array<any> = []
  tripOffers: Array<any> = []
  countryColors: Array<any> = []
  highlights: Array<any> = []
  bookingClasses: Array<BookingClass> = []

  currentLand: Country
  currentTripOffer: TripOffer

  backgroundColor: any
  fontColor: any
  matCardShadow: any
  matCardShadowHighlight: any
  mapBg: any

  panelOpenState = false;

  anmeldeFristVorbei = false;
  loadFinished: boolean = true

  displayedColumns: string[] = ['tarife', 'preise'];
  bookingClassesDataSource: MatTableDataSource<BookingClass>;

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private reiseAngebotsService: TripOfferService,
    private countriesService: CountryService,
    private sanitizer: DomSanitizer
  ) {
    this.countryColors = CountriesColors.data
    this.highlights = Highlights.daten
    this.bookingClasses = BookingClassen.daten
  }

  ngOnInit(): void {
    this.setCurrentLandAndTO();
  }

  checkIfExpanded(index: number): boolean {
    return index === 0
  }

  bookingFormDialog() {
    const dialog = this.dialog.open(BookingFormComponent, {
      width: '750px',
      height: '800px',
      disableClose : true,
      autoFocus : true
    });

    dialog.componentInstance.land = this.currentLand;
    dialog.componentInstance.currentTripOffer = this.currentTripOffer;
  }

  getNumberOfDays(): number {
    let numberOfDay = 0
    if (this.currentTripOffer?.id) {
      const diff = Math.abs(new Date(this.currentTripOffer.endDatum).getTime() - new Date(this.currentTripOffer.startDatum).getTime());
      numberOfDay = Math.ceil(diff / (1000 * 3600 * 24));
    }
    return numberOfDay
  }

  checkIfStudentenTarif(): boolean {
    return this.currentTripOffer?.buchungsklassenReadListTO
      .map(item => item.type)
      .filter(type => type.toLowerCase().includes('studenten-tarif' || 'studenten tarif' || 'studententarif')).length > 0
  }

  private setCurrentLandAndTO(): void {
    this.loadFinished = false
    this.route.params.subscribe(params => {
      if (params.landId) {

        this.reiseAngebotsService.getOne(params.landId).subscribe({
          next: (current: TripOffer) => {
            this.currentTripOffer = current;
            console.log('trip-Off: ', this.currentTripOffer);

            if(this.currentTripOffer?.id) {
              this.bookingClasses = this.currentTripOffer.buchungsklassenReadListTO
              this.bookingClassesDataSource = new MatTableDataSource(this.bookingClasses)
            }

            this.anmeldeFristVorbei = (new Date(this.currentTripOffer.anmeldungsFrist) < new Date()) ? true : false;

            this.countriesService.getOne(this.currentTripOffer.landId).subscribe({
              next: (land: Country) => {

                let objectURL = "data:image/png;base64," + land.karte_bild;
                land.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.currentLand = land;
                console.log('land', this.currentLand)

                this.mapBg = {background: "url('assets/img/" + this.currentLand.karte_bild + "')"}

                this.setStandardColors();
              }
            });
          }
        });
      }
    })
  }

  private setStandardColors(): void {
    const currentBgColor = this.countryColors.filter(item =>
      item.landName.toLowerCase().includes(this.currentLand.name.toLowerCase().split(' ')[0]))[0]

    this.backgroundColor = { background: currentBgColor?.bodyBgColor }
    this.fontColor = { color: currentBgColor?.bodyBgColor }
    this.matCardShadow = { 'box-shadow': '1px 1px 14px 2px ' + currentBgColor?.bodyBgColor }
    this.matCardShadowHighlight = { 'box-shadow': '1px 1px 5px 1px ' + currentBgColor?.bodyBgColor }

    // To transfer standard colours to other components
    const sharedBgColor = {
      header: { background: currentBgColor?.headerBgColor },
      bodyAndFooter: { background: currentBgColor?.bodyBgColor },
    }
    this.sharedDataService.changeCurrentBackgroundColor(sharedBgColor)

    this.loadFinished = true
  }

}
