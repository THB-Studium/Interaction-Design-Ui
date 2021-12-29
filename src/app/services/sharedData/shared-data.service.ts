/**
 * This service will be responsible to share data between components.
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Admin } from "src/app/models/admin";
import { Traveler } from "src/app/models/traveler";
import { TripOffer } from "src/app/models/tripOffer";

@Injectable({
  providedIn: "root",
})
export class SharedDataService {
  // Flags that give information about the method that is currently has to be done. Change it to false if it is an edit.
  public isAddBtnClicked: boolean = true;

  constructor() {}

  //#region  Admin
  private admin: Admin = {
    id: "",
    email: "",
    name: "",
    kennwort: "",
  };
  private adminSource = new BehaviorSubject<Admin>(this.admin);
  // Contains all information of the admin that has been selected/edited.
  public currentAdmin = this.adminSource.asObservable();

  changeCurrentAdmin(admin: Admin) {
    this.adminSource.next(admin);
  }
  //#endregion admin

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
    startbild: "",
    plaetze: 0,
    freiPlaetze: 0,
    interessiert: 0,
    leistungen: [],
    mitreiseberechtigt: [],
    hinweise: [],
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
}
