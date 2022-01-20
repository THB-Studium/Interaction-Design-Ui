import { Component, OnInit } from '@angular/core';
import { Country } from "../../models/country";
import { Countries } from "../../shared/datas/countries";
import { SlideList } from "../../shared/datas/slideList";
import { Slide } from "../../models/slide";
import { format } from 'date-fns';
import { Feedback } from "../../models/feedback";
import { Feedbacks } from "../../shared/datas/feedbacks";
import { TripOffers } from "../../shared/datas/trip-offers";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  slideList: Array<Slide> = [];
  reiseAngebot: Array<Country> = [];
  tripOffers: Array<any> = []
  feedbacks: Array<Feedback> = [];
  currentFb: Feedback
  currentIndex: number
  dialogConfig = new MatDialogConfig();

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.slideList = SlideList.data;
    this.reiseAngebot = Countries.data;
    this.tripOffers = TripOffers.data
    this.feedbacks = Feedbacks.data.filter(fb => fb.veroefentlich === true)

    this.currentFb = this.feedbacks[0]
    this.currentIndex = 0
    this.dialogConfiguration()
  }

  ngOnInit(): void {
    console.log(this.reiseAngebot)
  }

  getTripOffer(landId: string): any {
    return this.tripOffers.filter(tf => tf.landId === landId)[0]
  }

  setDate(landId: string, type: string): string {
    const tripOffer = this.getTripOffer(landId)
    let date = ''

    if(tripOffer?.id) {
      if(type === 'startDate') {
        const dateToString = format(tripOffer.startDatum, 'dd.MMM.yyyy').split('.')
        date = dateToString[0] + '.' + dateToString[1] + ' - '
      }

      else if(type === 'endDate') {
        date = format(tripOffer.endDatum, 'dd.MMM.yyyy')
      }
    }

    return date
  }

  setBackground(landId: string): string {
    return "background-image: url('assets/img/travel-offer/" + this.getTripOffer(landId).startbild + "')"
  }

  routeToLearnMore(LandId: string): void {
    this.router.navigate(['../learn-more', LandId])
  }

  feedbackAktion(action: string) {
    if(action == 'next') {
      this.currentIndex + 1 < this.feedbacks.length ? this.currentIndex++ : this.currentIndex = 0
    }

    else if(action == 'prev') {
      this.currentIndex > 0 ? this.currentIndex-- : this.currentIndex = this.feedbacks.length - 1
    }

    this.currentFb = this.feedbacks[this.currentIndex]
  }

  feedbackTeilenDialog(dialogForm: any): void {
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  private dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }
}
