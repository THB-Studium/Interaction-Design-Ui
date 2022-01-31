import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { CountriesColors } from "../../shared/datas/countries-colors";
import { SharedDataService } from "../../services/sharedData/shared-data.service";
import { Highlights } from "../../shared/datas/highlights";
import { MatDialog } from '@angular/material/dialog';
import { BookingFormComponent } from 'src/app/components/forms/booking-form/booking-form.component';
import { BookingClassen } from "../../shared/datas/bookingClassen";
import { BookingClass } from "../../models/bookingClass";
import { TripOfferService } from 'src/app/services/trip-offer/trip-offer.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { CountryService } from 'src/app/services/country/country.service';
import { TripOffer } from "../../models/tripOffer";
import { MatTableDataSource } from "@angular/material/table";
import { Country } from "../../models/country";

@Component({
  selector: 'app-learn-more',
  templateUrl: './learn-more.component.html',
  styleUrls: ['./learn-more.component.css']
})
export class LearnMoreComponent implements OnInit, AfterViewChecked {
  countries: Array<any> = []
  tripOffers: Array<any> = []
  currentLand: Country
  currentTripOffer: TripOffer

  // for style and view setting:
  backgroundColor: any
  fontColor: any
  matCardShadow: any
  matCardShadowHighlight: any
  matCardHeight: any

  panelOpenState = false;
  anmeldeFristVorbei = false;
  loadFinished: boolean = true

  // about Kosten table
  displayedColumns: string[] = ['tarife', 'preise'];
  bookingClassesDataSource: MatTableDataSource<BookingClass>;

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private reiseAngebotsService: TripOfferService,
    private countriesService: CountryService,
    private sanitizer: DomSanitizer
  ) { }


  ngOnInit(): void {
    this.setCurrentLandAndTO();
  }

  ngAfterViewChecked(): void {
    const height1 = document.getElementById('mat-card-group-1')?.getBoundingClientRect()?.height
    const height2 = document.getElementById('mat-card-group-2')?.getBoundingClientRect()?.height

    if (height1 && height2) {
      this.matCardHeight = height1 > height2 ? { 'height.px': height1 } : { 'height.px': height2 }
    }
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

  private setCurrentLandAndTO(): void {
    this.loadFinished = false
    this.route.params.subscribe(params => {
      if (params.landId) {

        this.reiseAngebotsService.getOne(params.landId).subscribe({
          next: (current: TripOffer) => {
            this.currentTripOffer = current;
            //this.currentTripOffer
            console.log('LearnMoreComponent::trip-Offers: ', this.currentTripOffer);

            if(this.currentTripOffer?.id) {
              this.bookingClassesDataSource = new MatTableDataSource(this.currentTripOffer.buchungsklassenReadListTO)
            }

            this.anmeldeFristVorbei = (new Date(this.currentTripOffer.anmeldungsFrist) < new Date()) ? true : false;

            this.countriesService.getOne(this.currentTripOffer.landId).subscribe({
              next: (land: Country) => {

                let objectURL = "data:image/png;base64," + land.karte_bild;
                land.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.currentLand = land;
                console.log('LearnMoreComponent::land', this.currentLand)

                land.highlights.map(highligh => {
                  let objectURL = "data:image/png;base64," + land.karte_bild;
                  return highligh.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                });

                this.setStandardColors();
              }
            });
          }
        });
      }
    })
  }

  private setStandardColors(): void {
    const currentBgColor = CountriesColors.data.filter(item =>
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

  private convertByteToImage(bytearray: string): SafeUrl {
    const objectURL = `data:image/png;base64,${bytearray}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

}
