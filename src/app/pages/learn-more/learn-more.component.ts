import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Country } from "../../models/country";
import {Countries} from "../../shared/datas/countries";
import {TripOffers} from "../../shared/datas/trip-offers";
import {TripOffer} from "../../models/tripOffer";
import {format} from "date-fns";
import {CountriesColors} from "../../shared/datas/countries-colors";
import {SharedDataService} from "../../services/sharedData/shared-data.service";
import {Highlights} from "../../shared/datas/highlights";

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

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
  ) {
    this.countries = Countries.data
    this.tripOffers = TripOffers.data
    this.countryColors = CountriesColors.data
    this.highlights = Highlights.daten
  }

  ngOnInit(): void {
    this.setCurrentLandAndTO()
  }

  setDate(date: Date, type: string): string {
    if(type === 'startDate') {
      const dateToString = format(date, 'dd.MMM.yyyy').split('.')
      return dateToString[0] + '.' + dateToString[1] + ' - '
    }

    else if(type === 'endDate') {
      return format(date, 'dd.MMM.yyyy')
    }
  }

  checkIfExpanded(index: number): boolean {
    return index === 0
  }

  private setCurrentLandAndTO(): void {
    this.route.params.subscribe(params => {
      if (params['landId']) {
        this.currentLand = this.countries.filter(land => land.id === params['landId'])[0]
        console.log('LearnMoreComponent :: setCurrentLandAndTO :: currentLand', this.currentLand);

        if (this.currentLand.id) {
          this.mapBg = {background: "url('assets/img/" + this.currentLand.karte_bild + "')"}

          this.setStandardColors()

          this.currentTripOffer = this.tripOffers.filter(to => to.landId === params['landId'])[0]
          console.log('LearnMoreComponent :: setCurrentLandAndTO :: currentTripOffer', this.currentTripOffer);
        }
      }
    })
  }

  private setStandardColors(): void {
    const currentBgColor = this.countryColors.filter(item =>
      item.landName.toLowerCase().includes(this.currentLand.name.toLowerCase().split(' ')[0]))[0]

    this.backgroundColor = { background: currentBgColor.bodyBgColor }
    this.fontColor = { color: currentBgColor.bodyBgColor }
    this.matCardShadow = { 'box-shadow': '1px 1px 14px 2px ' + currentBgColor.bodyBgColor }
    this.matCardShadowHighlight = { 'box-shadow': '1px 1px 5px 1px ' + currentBgColor.bodyBgColor }

    const sharedBgColor = {
      header: { background: currentBgColor.headerBgColor },
      bodyAndFooter: { background: currentBgColor.bodyBgColor },
    }
    this.sharedDataService.changeCurrentBackgroundColor(sharedBgColor)
  }

}
