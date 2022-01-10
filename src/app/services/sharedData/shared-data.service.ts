/**
 * This service will be responsible to share data between components.
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { BookingClass } from "src/app/models/bookingClass";
import { Expectation } from "src/app/models/expectation";
import { User } from "src/app/models/user";
import { Traveler } from "src/app/models/traveler";
import { TripOffer } from "src/app/models/tripOffer";

@Injectable({
  providedIn: "root",
})
export class SharedDataService {
  // Flags that give information about the method that is currently has to be done. Change it to false if it is an edit.
  public isAddBtnClicked: boolean = true;

  constructor() {}

  //#region  Users
  private user: User = {
    id: "",
    email: "",
    name: "",
    role: "",
    surname: "",
    password: "",
    creationDate: null,
    updateDate: null,
  };
  private userSource = new BehaviorSubject<User>(this.user);
  // Contains all information of the user that has been selected/edited.
  public currentUser = this.userSource.asObservable();

  changeCurrentUser(user: User) {
    this.userSource.next(user);
  }
  //#endregion Users

  //#region Traveler
  private traveler: Traveler = {
    id: "",
    name: "",
    vorname: "",
    studiengang: "",
    telefonnummer: 0,
    adresse: "",
    arbeitBei: "",
    email: "",
    geburtsdatum: new Date(),
    hochschule: "",
    schonTeilgenommen: false,
  };

  private travelerSource = new BehaviorSubject<Traveler>(this.traveler);
  public currentTraveler = this.travelerSource.asObservable();

  changeCurrentTraveler(traveler: Traveler) {
    this.travelerSource.next(traveler);
  }
  //#endregion

  //#region offers
  private tripoffer: TripOffer = {
    id: "",
    titel: "",
    anmeldungsFrist: new Date(),
    startDatum: new Date(),
    endDatum: new Date(),
    startbild: null,
    plaetze: 0,
    freiPlaetze: 0,
    interessiert: 0,
    leistungen: [],
    mitReiserBerechtigt: [],
    hinweise: "",
    sonstigeHinweise: "",
    landId: "",
    buchungsklassenReadListTO: null,
    erwartungenReadListTO: null,
  };

  private tripOfferSource = new BehaviorSubject<TripOffer>(this.tripoffer);
  public currenttripOfferSource = this.tripOfferSource.asObservable();

  changeCurrentTripOffer(tripoffer: TripOffer) {
    this.tripOfferSource.next(tripoffer);
  }
  //#endregion offers

  //#region bookinclass
  private bookingclass: BookingClass = {
    id: "",
    type: "",
    description: "",
    preis: 0,
    reiseAngebotId: "",
  };
  private bookingclassSource = new BehaviorSubject<BookingClass>(
    this.bookingclass
  );
  public currentBookingclass = this.bookingclassSource.asObservable();

  changeCurrentBookinclass(bookingclass: BookingClass) {
    this.bookingclassSource.next(bookingclass);
  }
  //#endregion bookinclass

  //#region bookinclass
  private expectation: Expectation = {
    id: "",
    abenteuer: 0,
    entschleunigung: 0,
    konfort: 0,
    nachhaltigkeit: 0,
    reiseAngebotId: "",
    road: 0,
    sicherheit: 0,
    sonne_strand: 0
  };
  private expectationSource = new BehaviorSubject<Expectation>(
    this.expectation
  );
  public currentExpectation = this.expectationSource.asObservable();

  changeCurrentExpectation(expectation: Expectation) {
    this.expectationSource.next(expectation);
  }
  //#endregion bookinclass
}
