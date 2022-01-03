import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { User } from "src/app/models/user";

@Component({
  selector: "app-admin-form",
  templateUrl: "./admin-form.component.html",
  styleUrls: ["./admin-form.component.css"],
})
export class AdminFormComponent implements OnInit, AfterViewInit {
  // Defines notifyAdminFormValid. Notify the parent when the form is valid
  @Output() notifyAdminFormValid = new EventEmitter<boolean>(false);
  // Defines AdminForm
  adminForm = new FormGroup({
    // firstname
    firstname: new FormControl("", [Validators.required]),
    // lastname
    lastname: new FormControl("", [Validators.required]),
    // email
    email: new FormControl("", [Validators.required, Validators.email]),
    // password
    pwd: new FormControl("", [Validators.required, Validators.minLength(8)]),
    // pwdRepeat
    pwdRepeat: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  // Defines currentAdmin. Contains complet current admin information.
  currentAdmin: User;
  // Defines currentAdminId. Contains the id of the current admin. Helpfull to handle an edit process.
  currentAdminId: string = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAdd: boolean = true;
  // Defines hide. By default we hide the password input field.
  hidePwd = true;
  // Defines hideConfirmPwd
  hideConfirmPwd = true;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.initAdminForm();
  }

  ngAfterViewInit() {
    this.onFormValuesChanged();
  }

  // Calls on onload. This will help to know if we want to edit an admin or add a new one.
  // The method need the shareDataService as well, to populate those information.
  private initAdminForm() {
    this.isAdd = this.sharedDataService.isAddBtnClicked;
    // Get and display existing information. Some need to be saved (the id and password).
    this.sharedDataService.currentUser
    .subscribe((value) => {
      this.adminForm.setValue({
        lastname: value.name,
        firstname: value.surname,
        email: value.email,
        // remove the pwd for security reason
        pwd: "",
        pwdRepeat: "",
      });
      // save id and pwd
      this.currentAdminId = value.id;
    })
    // to avoid recursion.
    .unsubscribe();
  }

  // Always get the value from the form and update the current admin information when any input value changed
  private onFormValuesChanged(): void {
    this.adminForm.valueChanges.subscribe(() => {

      let id = null;
      let updateddate = null;
      let password = this.adminForm.value.pwd.trim();

      if (!this.isAdd) {
        id = this.currentAdminId;
        updateddate = new Date();
        // if any key is null the value will not be updated in backend
        password = null;
      }

      this.currentAdmin = {
        id: id,
        name: this.transformName(this.adminForm.value.lastname),
        surname: this.transformName(this.adminForm.value.firstname),
        email: this.adminForm.value.email.trim(),
        password: password,
        // the role is automatically added in backend
        role: null,
        creationDate: new Date(),
        updateDate: updateddate
      };

      // First check what process is be done to know how and when to notify others components.
      if (this.isFormValid()) {
        this.sharedDataService.changeCurrentUser(this.currentAdmin);
        // notify the parent that the form is valid
        this.notifyAdminFormValid.emit(true);
      } else {
        // notify the parent that the form is not valid
        this.notifyAdminFormValid.emit(false);
      }
    });
  }

  private isFormValid(): boolean {
    if (this.isAdd) {
      if (this.adminForm.get("lastname").valid &&
      this.adminForm.get("firstname").valid &&
      this.adminForm.get("email").valid &&
      this.adminForm.get("pwd").valid &&
      this.adminForm.get("pwd").value ===
      this.adminForm.get("pwdRepeat").value) {
        return true;
      }
    }

    if (!this.isAdd) {
      if (this.adminForm.get("lastname").valid &&
      this.adminForm.get("firstname").valid &&
      this.adminForm.get("email").valid) {
        return true;
      }
    }

    return false;
  }

  // Transforms the first character of the lastname and firstname to upper
  private transformName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).trim();
  }
}
