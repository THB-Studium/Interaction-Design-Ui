import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";

import { BookingFormComponent } from "src/app/components/forms/booking-form/booking-form.component";

import { AccommodationService } from "src/app/services/accommodation/accommodation.service";
import { CountryService } from "src/app/services/country/country.service";
import { HighlightService } from "src/app/services/highlight/highlight.service";
import { SharedDataService } from "../../services/sharedData/shared-data.service";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";

import { BookingClass } from "../../models/bookingClass";
import { Country } from "../../models/country";
import { TripOffer } from "../../models/tripOffer";

@Component({
  selector: "app-learn-more",
  templateUrl: "./learn-more.component.html",
  styleUrls: ["./learn-more.component.css"],
})
export class LearnMoreComponent implements OnInit {
  countries: Array<any> = [];
  tripOffers: Array<any> = [];
  currentLand: Country;
  currentTripOffer: TripOffer;

  // for style and view setting:
  backgroundColor: any;
  fontColor: any;
  matCardShadow: any;
  matCardShadowHighlight: any;

  panelOpenState = false;
  anmeldeFristVorbei = false;
  loadFinished: boolean = false;

  // about Kosten table
  displayedColumns: string[] = ["tarife", "preise"];
  bookingClassesDataSource: MatTableDataSource<BookingClass>;

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private reiseAngebotsService: TripOfferService,
    private countriesService: CountryService,
    private highlightService: HighlightService,
    private accommodationService: AccommodationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.setCurrentLandAndTO();
  }

  ngOnDestroy(): void {
    // Reset the color
    this.sharedDataService.changeCurrentBackgroundColors({
      header: "",
      bodyAndFooter: "",
    });
  }

  checkIfExpanded(index: number): boolean {
    return index === 0;
  }

  bookingFormDialog() {
    const dialog = this.dialog.open(BookingFormComponent, {
      maxWidth: "800px",
      maxHeight: "800px",
      disableClose: true,
      // autoFocus : true
    });

    dialog.componentInstance.land = this.currentLand;
    dialog.componentInstance.currentTripOffer = this.currentTripOffer;
  }

  getNumberOfDays(): number {
    let numberOfDay = 0;
    if (this.currentTripOffer?.id) {
      const diff = Math.abs(
        new Date(this.currentTripOffer.endDatum).getTime() -
          new Date(this.currentTripOffer.startDatum).getTime()
      );
      numberOfDay = Math.ceil(diff / (1000 * 3600 * 24));
    }
    return numberOfDay;
  }

  getImage(bild: any): any {
    return this.sanitizer.bypassSecurityTrustUrl(
      "data:image/png;base64," + bild
    );
  }

  setOpacityColor(): string {
    if (this.currentLand?.bodyFarbe) {
      const color: string = this.currentLand.bodyFarbe

      // for rgb colors:
      if (color.startsWith('rgb')) {
        return color.replace(')', ',0.05)')
      }

      // for hex colors:
      if (color.startsWith('#')) {
        return this.hexToRgbA(color)
      }
    }
  }

  private hexToRgbA(hex: string): string {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
        c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.05)';
    }
    throw new Error('Bad Hex');
  }

  private setCurrentLandAndTO(): void {
    this.route.params.subscribe((params) => {
      if (params.landId) {
        this.reiseAngebotsService.getOne(params.landId).subscribe({
          next: (current: TripOffer) => {
            this.currentTripOffer = current;
            if (this.currentTripOffer?.id) {
              this.bookingClassesDataSource = new MatTableDataSource(
                this.currentTripOffer.buchungsklassenReadListTO
              );
            }

            this.anmeldeFristVorbei = new Date(this.currentTripOffer.anmeldungsFrist) < new Date();

            this.getCurrentOfferAssociatedInfo(this.currentTripOffer.landId);
          },
        });
      }
    });
  }

  private getCurrentOfferAssociatedInfo(countryId: string) {
    this.countriesService.getOne(countryId).subscribe({
      next: (land: Country) => {
        let objectURL = "data:image/png;base64," + land.karte_bild;
        land.realImage =
          this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.currentLand = land;
        // set navbar and footer background
        this.setStandardColors();
      },
      complete: () => {
        // Get image attached to each highligth
        // read the associated image for each country
        if (this.currentLand.highlights.length > 0) {
          this.currentLand.highlights.forEach((highlight) => {
            this.highlightService.getOne(highlight.id).subscribe({
              next: (result) => {
                highlight.realImage = this.convertByteToImage(
                  result.bild
                );
              },
              complete: () => {
                // get also each accommodation attached images
                if (this.currentLand.unterkunft.length > 0) {
                  this.currentLand.unterkunft.forEach((x) => {
                    this.accommodationService.getOne(x.id).subscribe({
                      next: (result) => {
                        x.bilder = result.bilder;
                      },
                      complete: () => (this.loadFinished = true),
                    });
                  });
                } else {
                  this.loadFinished = true
                }
              },
            });
          });
        } else {
          this.loadFinished = true
        }
      }
  });
  }

  private setStandardColors(): void {
    this.backgroundColor = { background: this.currentLand?.bodyFarbe };
    this.fontColor = { color: this.currentLand?.bodyFarbe };
    this.matCardShadow = {
      "box-shadow": "1px 1px 14px 2px " + this.currentLand?.bodyFarbe,
    };
    this.matCardShadowHighlight = {
      "box-shadow": "1px 1px 5px 1px " + this.currentLand?.bodyFarbe,
    };

    // To transfer standard colours to other components
    this.sharedDataService.changeCurrentBackgroundColors({
      header: this.currentLand?.headerFarbe,
      bodyAndFooter: this.currentLand?.bodyFarbe,
    });
  }

  private convertByteToImage(bytearray: any): SafeUrl {
    const objectURL = `data:image/png;base64,${bytearray}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }
}
