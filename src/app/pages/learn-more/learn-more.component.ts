import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import {Countries} from "../../shared/datas/countries";
import {TripOffers} from "../../shared/datas/trip-offers";
import {TripOffer} from "../../models/tripOffer";

import {CountriesColors} from "../../shared/datas/countries-colors";
import {SharedDataService} from "../../services/sharedData/shared-data.service";
import {Highlights} from "../../shared/datas/highlights";
import { MatDialog } from '@angular/material/dialog';
import { BookingFormComponent } from 'src/app/components/forms/booking-form/booking-form.component';
import { TripOfferService } from 'src/app/services/trip-offer/trip-offer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CountryService } from 'src/app/services/country/country.service';

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

  currentLand: any
  currentTripOffer: TripOffer

  backgroundColor: any
  fontColor: any
  matCardShadow: any
  matCardShadowHighlight: any
  mapBg: any

  panelOpenState = false;

  anmeldeFristVorbei = false;

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private reiseAngebotsService: TripOfferService,
    private countriesService: CountryService,
    private sanitizer: DomSanitizer
  ) {
    this.countries = Countries.data
    this.tripOffers = TripOffers.data
    this.countryColors = CountriesColors.data
    this.highlights = Highlights.daten
  }

  ngOnInit(): void {
    this.setCurrentLandAndTO();
  }

  checkIfExpanded(index: number): boolean {
    return index === 0
  }

  private setCurrentLandAndTO(): void {
    this.route.params.subscribe(params => {
      //console.log(params.landId)
      if (params.landId) {

        this.reiseAngebotsService.getOne(params.landId).subscribe({
          next: (current) => {
            this.currentTripOffer = current;
            console.log('tripf', this.currentTripOffer);

            this.anmeldeFristVorbei = (new Date(this.currentTripOffer.anmeldungsFrist) < new Date()) ? true : false;

            this.countriesService.getOne(this.currentTripOffer.landId).subscribe({
              next: (land) => {

                let objectURL = "data:image/png;base64," + land.karte_bild;
                land.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.currentLand = land;
                //console.log('land', this.currentLand)

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

    this.backgroundColor = { background: '#E88113' }
    this.fontColor = { color: currentBgColor?.bodyBgColor }
    this.matCardShadow = { 'box-shadow': '1px 1px 14px 2px ' + currentBgColor?.bodyBgColor }
    this.matCardShadowHighlight = { 'box-shadow': '1px 1px 5px 1px ' + currentBgColor?.bodyBgColor }

    const sharedBgColor = {
      header: { background: currentBgColor?.headerBgColor },
      bodyAndFooter: { background: currentBgColor?.bodyBgColor },
    }
    this.sharedDataService.changeCurrentBackgroundColor(sharedBgColor)
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

}
