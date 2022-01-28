import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";
import { FeedbackService } from "src/app/services/feedback/feedback.service";
import { ToastrService } from "ngx-toastr";

import { Slide } from "../../models/slide";
import { SlideList } from "src/app/shared/datas/slideList";

import { Feedback } from "src/app/models/feedback";
import { TripOffer } from "src/app/models/tripOffer";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  slideList: Array<Slide> = [];
  //reiseAngebot: Array<Country> = [];
  tripOffers: Array<TripOffer> = [];
  feedbacks: Array<Feedback> = [];
  currentFeedback: Feedback;
  currentIndex: number;
  dialogConfig = new MatDialogConfig();
  readonly defaultFeedbackImg = "assets/img/feedback/fb-1.jpg";

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private reiseAngebotsService: TripOfferService,
    private sanitizer: DomSanitizer,
    private feedbackService: FeedbackService,
    private toastrService: ToastrService
  ) {
    this.slideList = SlideList.data;
    this.currentIndex = 0;
  }

  ngOnInit(): void {
    // get offers list
    this.getAllTripoffers();
    // Get all feedbacks
    this.getAllFeedbacks();
  }

  getAllTripoffers() {
    this.reiseAngebotsService.getAll().subscribe({
      next: (bg) => {
        this.tripOffers = bg
          .map((tripOffer) => {
            tripOffer.realImage = this.convertByteToImage(tripOffer.startbild);
            return tripOffer;
          })
          .filter(
            (trip) =>
              trip.landId !== null && new Date(trip.endDatum) > new Date()
          );
      },
    });
  }

  private getAllFeedbacks() {
    this.feedbackService.getAll().subscribe({
      next: (result) => (this.feedbacks = result),
      error: () => {
        this.toastrService.info("Die Feedbacks werden bald wieder angezeigt");
      },
      complete: () => {
        // filter the feedbacks
        const feedbacks = this.feedbacks.filter(
          (x) => x.veroefentlich === true
        );
        // clear the list
        this.feedbacks = [];
        // get each feedback by in oder to retrieve the attached image
        feedbacks.forEach((x) => {
          this.feedbackService.getOne(x.id).subscribe({
            next: (result: Feedback) => {
              if (result.bild) {
                result.bild = this.convertByteToImage(result.bild);
              } else {
                result.bild = this.defaultFeedbackImg;
              }
              // add to the list
              this.feedbacks.push(result);
            },
            complete: () => (this.currentFeedback = this.feedbacks[0]),
          });
        });
      },
    });
  }

  routeToLearnMore(gebotId: string): void {
    this.router.navigate(["/learn-more", gebotId]);
  }

  feedbackAktion(action: string) {
    if (action == "next") {
      this.currentIndex =
        this.currentIndex + 1 < this.feedbacks.length ? ++this.currentIndex : 0;
    } else if (action == "prev") {
      this.currentIndex =
        this.currentIndex > 0 ? --this.currentIndex : this.feedbacks.length - 1;
    }

    this.currentFeedback = this.feedbacks[this.currentIndex];
  }

  feedbackTeilenDialog(dialogForm: any): void {
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  convertByteToImage(bytearray: string): SafeUrl {
    const objectURL = `data:image/png;base64,${bytearray}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }
}
