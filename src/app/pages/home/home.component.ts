import { Component, OnInit } from '@angular/core';
import { Country } from "../../models/country";
import { Slide } from "../../models/slide";
import { Feedback } from "../../models/feedback";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SlideList } from 'src/app/shared/datas/slideList';
import { Countries } from 'src/app/shared/datas/countries';
import { Feedbacks } from 'src/app/shared/datas/feedbacks';
import { TripOfferService } from 'src/app/services/trip-offer/trip-offer.service';
import { DomSanitizer } from '@angular/platform-browser';

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
    private reiseAngebotsService: TripOfferService,
    private sanitizer: DomSanitizer
  ) {
    this.slideList = SlideList.data;
    this.reiseAngebot = Countries.data;

    this.feedbacks = Feedbacks.data.filter(fb => fb.veroefentlich === true);

    this.currentFb = this.feedbacks[0];
    this.currentIndex = 0;
  }

  ngOnInit(): void {
    console.log(this.reiseAngebot)
    this.reiseAngebotsService.getAll().subscribe({
      next: (bg) => {
        this.tripOffers = bg.map((tripOffer) => {
          //convert image
          let objectURL = "data:image/png;base64," + tripOffer.startbild;
          tripOffer.realImage =
            this.sanitizer.bypassSecurityTrustUrl(objectURL);
          return tripOffer;
        }).filter(trip => trip.landId !== null && new Date(trip.endDatum) > new Date());
        console.log(bg);
      }
    });
  }

  getTripOffer(landId: string): any {
    return this.tripOffers.filter(tf => tf.landId === landId)[0];
  }

  routeToLearnMore(gebotId: string): void {
    this.router.navigate(['../learn-more', gebotId]);
  }

  feedbackAktion(action: string) {
    if(action == 'next') {
      this.currentIndex = this.currentIndex + 1 < this.feedbacks.length ? this.currentIndex++ : 0;
    }

    else if(action == 'prev') {
      this.currentIndex = this.currentIndex > 0 ? this.currentIndex-- : this.feedbacks.length - 1;
    }

    this.currentFb = this.feedbacks[this.currentIndex];
  }

  feedbackTeilenDialog(dialogForm: any): void {
    this.dialog.open(dialogForm, this.dialogConfig);
  }

}
