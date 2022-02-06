import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { CountriesColors } from "../../shared/datas/countries-colors";
import { SharedDataService } from "../../services/sharedData/shared-data.service";
import { MatDialog } from '@angular/material/dialog';
import { BookingFormComponent } from 'src/app/components/forms/booking-form/booking-form.component';
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
export class LearnMoreComponent implements OnInit {
  countries: Array<any> = []
  tripOffers: Array<any> = []
  currentLand: Country
  currentTripOffer: TripOffer

  bilder = [
    'blaue-lagune.jpg', 'geysir.jpg', 'joekursalon.jpg',
    'polarlicht.jpg', 'reykjavik.jpg', 'vulkan-hekia-and-katla.jpg'
  ]

  // for style and view setting:
  backgroundColor: any
  fontColor: any
  matCardShadow: any
  matCardShadowHighlight: any

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

  ngOnDestroy(): void {
    // Reset the color
    this.sharedDataService.changeCurrentBackgroundColors({
      header: '',
      bodyAndFooter: '',
    });
  }

  checkIfExpanded(index: number): boolean {
    return index === 0
  }

  bookingFormDialog() {
    const dialog = this.dialog.open(BookingFormComponent, {
      maxWidth: '800px',
      maxHeight: '800px',
      disableClose : true,
      // autoFocus : true
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

  getImage(bild: any): any {
    return this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64," + bild);
  }

  private setCurrentLandAndTO(): void {
    this.loadFinished = false
    this.route.params.subscribe(params => {
      if (params.landId) {

        this.reiseAngebotsService.getOne(params.landId).subscribe({
          next: (current: TripOffer) => {
            this.currentTripOffer = current;
            if(this.currentTripOffer?.id) {
              this.bookingClassesDataSource = new MatTableDataSource(this.currentTripOffer.buchungsklassenReadListTO)
            }

            this.anmeldeFristVorbei = (new Date(this.currentTripOffer.anmeldungsFrist) < new Date()) ? true : false;

            this.countriesService.getOne(this.currentTripOffer.landId).subscribe({
              next: (land: Country) => {
                let objectURL = "data:image/png;base64," + land.karte_bild;
                land.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.currentLand = land;

                land.highlights.map(highlight => {
                  return highlight.realImage = this.getImage(highlight.bild);
                });
              },
              complete: () => {
                // set navbar and footer background
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
    this.sharedDataService.changeCurrentBackgroundColors({
      header: this.currentLand?.headerFarbe,
      bodyAndFooter: this.currentLand?.bodyFarbe,
    });

    this.loadFinished = true
  }

  private convertByteToImage(bytearray: string): SafeUrl {
    const objectURL = `data:image/png;base64,${bytearray}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

}
