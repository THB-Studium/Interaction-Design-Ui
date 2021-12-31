/**
 * This service will be responsible to share data between components.
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

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
}
