/**
 * This service will be responsible to share data between components.
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Admin } from "src/app/models/Admin";

@Injectable({
  providedIn: "root",
})
export class SharedDataService {
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
  // Flags that give information about the method that is currently done. Change it to false if the user want to edit.
  public isAddAdmin: boolean = true;

  changeCurrentAdmin(admin: Admin) {
    this.adminSource.next(admin);
  }
  //#endregion admin
}
