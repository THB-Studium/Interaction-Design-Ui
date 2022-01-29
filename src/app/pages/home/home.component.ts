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
import { BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  slideList: Array<Slide> = [];
  tripOffers: Array<TripOffer> = [];
  feedbacks: Array<Feedback> = [];
  currentFeedback: Feedback;
  currentIndex: number;
  dialogConfig = new MatDialogConfig();
  readonly defaultFeedbackImg =
    "./assets/img/feedback/feedback-default-img.jpg";
  interrested: any[] = [];
  interessiertIds = new Subject<any>();

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

    this.interessiertIds.subscribe((inte: any[]) => {
      console.log(inte);
      this.tripOffers = this.tripOffers.map((trip) => {
        if (inte.indexOf(trip.id) != -1) {
          trip.isfavorite = true;
        } else {
          trip.isfavorite = false;
        }
        return trip;
      });
    });
  }

  getAllTripoffers() {
    this.reiseAngebotsService.getAll().subscribe({
      next: (bg) => {
        this.tripOffers = bg
          .map((tripOffer) => {
            this.interrested = JSON.parse(localStorage.getItem("ids"));
            if (this.interrested.indexOf(tripOffer.id) != -1) {
              tripOffer.isfavorite = true;
            } else {
              tripOffer.isfavorite = false;
            }
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
        // filter only feedbacks that are public.
        const feedbacks = this.feedbacks.filter(
          (x) => x.veroefentlich === true
        );
        // clear the list
        this.feedbacks = [];
        // get each feedback by id in oder to retrieve the attached image
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

  interessiert(id: string, action: string) {
    console.log(action)
    if(action === 'add') {
      this.reiseAngebotsService.interessiert(id).subscribe({
        error: (error) => {
          //console.log(error.error.text);
          if (error.error.text === "Successfully added") {
            if (localStorage.getItem("ids") == null) {
              //this.interrested.push(id);
              this.interrested = this.addId([id], this.interrested);
              localStorage.setItem("ids", JSON.stringify(this.interrested));
  
              this.interessiertIds.next(this.interrested);
            } else {
              this.interrested = JSON.parse(localStorage.getItem("ids"));
              //this.interrested.push(id);
              this.interrested = this.addId([id], this.interrested);
              localStorage.removeItem("ids");
              localStorage.setItem("ids", JSON.stringify(this.interrested));
              this.interessiertIds.next(this.interrested);
            }
          } else {
            this.toastrService.error("Fehler", "Fehler");
          }
        },
        complete: () => {
          this.toastrService.success(
            "Reiseangebot zu Favorits hinzugefügt",
            "Erfolgreich"
          );
        },
      });
    }

    if(action === 'remove') {
      this.reiseAngebotsService.uninteressiert(id).subscribe({
        error: (error) => {
          //console.log(error.error.text);
          if (error.error.text === "Successfully reset") {

            this.interrested = JSON.parse(localStorage.getItem("ids"));
            //this.interrested.push(id);
            this.interrested = this.addId([id], this.interrested);
            let id_delete = this.interrested.indexOf(id);
            this.interrested = this.interrested.splice(id_delete, 1);
            localStorage.removeItem("ids");
            localStorage.setItem("ids", JSON.stringify(this.interrested));
            this.interessiertIds.next(this.interrested);
            
          } else {
            this.toastrService.error("Fehler", "Fehler");
          }
        },
        complete: () => {
          this.toastrService.success(
            "Reiseangebot von Favorits gelöscht",
            "Erfolgreich"
          );
        },
      });
    }
  }

  addId(target, source) {
    source.forEach((v) => {
      var p = target.indexOf(v);
      if (p === -1) {
        target.push(v);
      } else {
        target.splice(p, 1);
      }
    });
    return target;
  }
}
