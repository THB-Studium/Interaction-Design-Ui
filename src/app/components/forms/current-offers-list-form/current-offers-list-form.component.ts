import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { debounceTime, delay, filter, takeUntil, tap, map } from 'rxjs/operators';

import { TripOffer } from "src/app/models/tripOffer";

@Component({
  selector: "app-current-offers-list-form",
  templateUrl: "./current-offers-list-form.component.html",
  styleUrls: ["./current-offers-list-form.component.css"],
})
export class CurrentOffersListFormComponent implements OnInit, OnDestroy {
  offersFilteringCtrl: FormControl = new FormControl();
  public searching = false;
  protected _onDestroy = new Subject<void>();
  // Defines selectedOffer
  public selectedOffer: FormControl;
  filteredOffers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  // Defines currentOffers
  currentOffers: TripOffer[];
  selectedTripOffer: TripOffer;

  constructor(private router: Router) {
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
    this.router.navigate(['reservation', this.selectedOffer.value.id]);
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
