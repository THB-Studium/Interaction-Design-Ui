import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';

import {TripOfferService} from 'src/app/services/trip-offer/trip-offer.service';
import {FeedbackService} from 'src/app/services/feedback/feedback.service';
import {ToastrService} from 'ngx-toastr';

import {Slide} from '../../models/slide';
import {SlideList} from 'src/app/shared/datas/slideList';

import {Feedback} from 'src/app/models/feedback';
import {TripOffer} from 'src/app/models/tripOffer';
import {Subject} from 'rxjs';
import {CountryService} from '../../services/country/country.service';
import {Country} from '../../models/country';
import {SharedDataService} from '../../services/sharedData/shared-data.service';
import {FeedbackFormComponent} from '../../components/forms/feedback-form/feedback-form.component';
import {MatDialog} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { NgIf, NgFor, UpperCasePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [
        NgIf,
        SpinnerComponent,
        NgFor,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        UpperCasePipe,
        DatePipe,
    ],
})
export class HomeComponent implements OnInit {
  slideList: Array<Slide> = [];
  tripOffers: Array<TripOffer> = [];
  feedbacks: Array<Feedback> = [];
  countries: Array<Country> = [];
  currentFeedback: Feedback;
  currentIndex: number;
  readonly defaultFeedbackImg =
    './assets/img/feedback/feedback-default-img.jpg';
  interested: any[] = [];
  interessiertIds = new Subject<any>();

  loadFeedBacksFinished: boolean = true;
  loadReiseangeboteFinished: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private reiseAngebotsService: TripOfferService,
    private countriesService: CountryService,
    private sanitizer: DomSanitizer,
    private feedbackService: FeedbackService,
    private toastrService: ToastrService,
    private sharedDataService: SharedDataService
  ) {
    this.slideList = SlideList.data;
    this.currentIndex = 0;
    // reset the header and the footer background color
    this.sharedDataService.changeCurrentBackgroundColors({
      header: '',
      bodyAndFooter: '',
    });
  }

  ngOnInit(): void {
    // get offers list
    this.getAllTripoffers();
    // Get all feedbacks
    this.getAllFeedbacks();

    this.interessiertIds.subscribe((inte: any[]) => {
      this.tripOffers = this.tripOffers.map((trip) => {
        trip.isfavorite = inte.indexOf(trip.id) != -1;
        return trip;
      });
    });
  }

  getCountryName(landId: string): string {
    const land = this.countries.filter((x: Country) => x.id === landId)[0];
    return land?.id ? land.name : '';
  }

  routeToLearnMore(gebotId: string): void {
    this.router.navigate(['/learn-more', gebotId]).then(() => {
    });
  }

  feedbackAktion(action: string): void {
    if (action == 'next') {
      this.currentIndex =
        this.currentIndex + 1 < this.feedbacks.length ? ++this.currentIndex : 0;
    } else if (action == 'prev') {
      this.currentIndex =
        this.currentIndex > 0 ? --this.currentIndex : this.feedbacks.length - 1;
    }

    this.currentFeedback = this.feedbacks[this.currentIndex];
  }

  onAddFeedback() {
    this.dialog.open(FeedbackFormComponent, {
      disableClose: true,
    });
  }

  convertByteToImage(bytearray: string): SafeUrl {
    const objectURL = `data:image/png;base64,${bytearray}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  interessiert(id: string, action: string): void {
    if (action === 'add') {
      this.reiseAngebotsService.interessiert(id).subscribe({
        error: (error) => {
          if (error.error.text === 'Successfully added') {
            if (localStorage.getItem('ids') == null) {
              this.interested = this.addId([id], this.interested);
              localStorage.setItem('ids', JSON.stringify(this.interested));

              this.interessiertIds.next(this.interested);
            } else {
              this.interested = JSON.parse(localStorage.getItem('ids'));
              this.interested = this.addId([id], this.interested);
              localStorage.removeItem('ids');
              localStorage.setItem('ids', JSON.stringify(this.interested));
              this.interessiertIds.next(this.interested);
            }
          } else {
            this.toastrService.error('Etwas ist schief gelaufen', 'Fehler');
          }
        },
      });
    }

    if (action === 'remove') {
      this.reiseAngebotsService.uninteressiert(id).subscribe({
        error: (error) => {
          if (error.error.text === 'Successfully updated') {
            this.interested = JSON.parse(localStorage.getItem('ids'));
            this.interested = this.addId([id], this.interested);
            let id_delete = this.interested.indexOf(id);
            this.interested = this.interested.splice(id_delete, 1);
            localStorage.removeItem('ids');
            localStorage.setItem('ids', JSON.stringify(this.interested));
            this.interessiertIds.next(this.interested);
          } else {
            this.toastrService.error('Etwas ist schief gelaufen', 'Fehler');
          }
        },
      });
    }
  }

  addId(target, source): any {
    source?.forEach((v) => {
      const p = target.indexOf(v);
      if (p === -1) {
        target.push(v);
      } else {
        target.splice(p, 1);
      }
    });
    return target;
  }

  private getAllTripoffers(): void {
    this.loadReiseangeboteFinished = false;
    this.reiseAngebotsService.getAll().subscribe({
      next: (bg) => {
        this.tripOffers = bg
          .map((tripOffer) => {
            this.interested = JSON.parse(localStorage.getItem('ids'));
            tripOffer.isfavorite = this.interested?.indexOf(tripOffer.id) != -1;
            tripOffer.realImage = this.convertByteToImage(tripOffer.startbild);
            return tripOffer;
          })
          .filter(
            (trip) =>
              trip.landId !== null && new Date(trip.endDatum) > new Date()
          );
      },
      complete: () => this.getAllCountries(),
    });
  }

  private getAllFeedbacks(): void {
    this.loadFeedBacksFinished = false;
    this.feedbackService.getAll().subscribe({
      next: (result) => (this.feedbacks = result),
      error: () => {
        this.toastrService.info('Die Feedbacks werden bald wieder angezeigt');
      },
      complete: () => {
        // filter only feedbacks that are public.
        const feedbacks = this.feedbacks.filter(
          (x) => x.veroeffentlich === true
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

        this.loadFeedBacksFinished = true;
      },
    });
  }

  private getAllCountries(): void {
    this.countriesService.getAll().subscribe({
      next: (countries: Array<Country>) => {
        this.countries = countries;
      },
      complete: () => (this.loadReiseangeboteFinished = true),
      error: (error) => console.log('Fehler beim Laden aller Länder', error),
    });
  }
}
