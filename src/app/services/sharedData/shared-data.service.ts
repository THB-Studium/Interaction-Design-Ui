/**
 * This service will be responsible to share data between components.
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Accommodation } from "src/app/models/accommodation";

import { Country } from "src/app/models/country";
import { CountryInformation } from "src/app/models/countryInformation";
import { Highlight } from "src/app/models/highlight";
import { User } from "src/app/models/user";
import { Traveler } from "src/app/models/traveler";

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
    updateDate: null
  };
  private userSource = new BehaviorSubject<User>(this.user);
  // Contains all information of the user that has been selected/edited.
  public currentUser = this.userSource.asObservable();

  changeCurrentUser(user: User) {
    this.userSource.next(user);
  }
  //#endregion Users

  //#region traveler
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
  //#endregion traveler

  //#region country
  private country: Country = {
    id: '',
    name: '',
    flughafen: [],
    unterkunft_text: '',
    karte_bild: [],
    landInfo: [],
    highlights: [],
    unterkunft: []
  };

  private countrySource = new BehaviorSubject<Country>(this.country);
  public currentCountry = this.countrySource.asObservable();

  changeCurrentCountry(country: Country) {
    this.countrySource.next(country);
  }
  //#endregion country

  //#region country information
  private countryInformation: CountryInformation = {
    id: "",
    titel: "",
    description: "",
    landId: ""
  }

  private countryInformationSource = new BehaviorSubject<CountryInformation>(this.countryInformation);
  public currentCountryInfo = this.countryInformationSource.asObservable();

  changeCurrentCountryInfo(countryInfo: CountryInformation) {
    this.countryInformationSource.next(countryInfo);
  }
  //#endregion country information

  //#region highlight
  private highlight: Highlight = {
    id: '',
    name: '',
    description: '',
    bild: null,
    landId: ''
  };
  private highlightSource = new BehaviorSubject<Highlight>(this.highlight);
  public currentHighlight = this.highlightSource.asObservable();

  changeCurrentHighlight(highlight: Highlight) {
    this.highlightSource.next(highlight);
  }
  //#endregion highlight

  //#region accommodation
  private accommodation: Accommodation = {
    id: '',
    name: '',
    addresse: '',
    link: '',
    beschreibung: '',
    bilder: [],
    landId: ''
  }

  private accommodationSource = new BehaviorSubject<Accommodation>(this.accommodation);
  public currentAccommodation = this.accommodationSource.asObservable();

  changeCurrentAccommodation(accommodation: Accommodation) {
    this.accommodationSource.next(accommodation);
  }
  //#endregion accommodation
}
