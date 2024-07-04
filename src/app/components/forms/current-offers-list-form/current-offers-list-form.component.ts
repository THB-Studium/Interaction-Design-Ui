import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, filter, map, takeUntil, tap} from 'rxjs/operators';

import {CountryService} from 'src/app/services/country/country.service';
import {BookingFormComponent} from '../booking-form/booking-form.component';

import {TripOffer} from 'src/app/models/tripOffer';
import {TripOfferService} from 'src/app/services/trip-offer/trip-offer.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import {RoutingPaths} from '../../../shared/const';

@Component({
    selector: 'app-current-offers-list-form',
    templateUrl: './current-offers-list-form.component.html',
    styleUrls: ['./current-offers-list-form.component.css'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatOptionModule,
        NgxMatSelectSearchModule,
        NgFor,
        NgIf,
        MatButtonModule,
        AsyncPipe,
    ],
})
export class CurrentOffersListFormComponent implements OnInit, OnDestroy {
  offersFilteringCtrl: FormControl = new FormControl();
  public searching = false;
  // Defines selectedOffer
  public selectedOffer: FormControl;
  filteredOffers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  // Defines currentOffers
  currentOffers: TripOffer[];
  selectedTripOffer: TripOffer;
  protected _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private countryService: CountryService,
    private tripOfferService: TripOfferService
  ) {
    this.selectedOffer = new FormControl();
    this.currentOffers = [];
  }

  ngOnInit(): void {
    this.filterOfferByName();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  startBookingProcess() {
    this.router.navigate([RoutingPaths.LEARN_MORE, this.selectedOffer.value.id]);
    let country = null;

    this.tripOfferService.getOne(this.selectedOffer.value.id).subscribe({
      next: (result) => {
        this.selectedTripOffer = result;
      },
      complete: () => {
        this.countryService.getOne(this.selectedOffer.value.landId).subscribe({
          next: (result) => country = result,
          complete: () => {
            const dialog = this.dialog.open(BookingFormComponent, {
              disableClose: true,
              autoFocus: true
            });
            // Set needed values
            dialog.componentInstance.land = country;
            dialog.componentInstance.currentTripOffer = this.selectedTripOffer;
          }
        });
      }
    });
  }

  filterOfferByName() {
    this.offersFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.currentOffers) {
            return [];
          }
          return this.currentOffers.filter(x => x.titel.toLowerCase().indexOf(search) > -1);
        }),
        delay(500),
        takeUntil(this._onDestroy)
      ).subscribe({
      next: (x) => {
        this.searching = false;
        this.filteredOffers.next(x);
      },
      error: () => this.searching = false
    });
  }
}
