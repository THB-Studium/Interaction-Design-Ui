import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Admin } from "src/app/models/Admin";

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
    // name
    name: new FormControl("", [Validators.required]),
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
  currentAdmin: Admin;
  // Defines currentAdminId. Contains the id of the current admin. Helpfull to handle an edit process.
  currentAdminId: string = "";
  // Defines currentAdminPwd. Contains the password of the current admin. Helpfull to handle an edit process.
  currentAdminPwd: string = "";
  // Defines isAdd. Flags to know if it is an add / edit process.
  isAdd: boolean = true;
  // Defines hidePwdInput. Will hide/display the pasword input respectively for edit or add process.
  hidePwdInput: boolean = false;
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
    this.isAdd = this.sharedDataService.isAddAdmin;

    if (!this.isAdd) {
      // Get and display existing information. Some need to be saved (the id and password).
      this.sharedDataService.currentAdmin
        .subscribe((value) => {
          this.adminForm.setValue({
            name: value.name,
            email: value.email,
            // remove the pwd for security reason
            pwd: "",
            pwdRepeat: "",
          });
          // save id and pwd
          this.currentAdminId = value.id;
          // Save the realy value of the pwd here
          this.currentAdminPwd = value.kennwort;
          // we hide the password input since that we want to edit
          this.hidePwdInput = true;
        })
        // to avoid recursion.
        .unsubscribe();
    } else {
      // All inputs need to be displayed.
      this.hidePwdInput = false;
    }
  }

  // Always get the value from the form and update the current admin information when any input value changed
  private onFormValuesChanged(): void {
    this.adminForm.valueChanges.subscribe(() => {
      if (this.isAdd) {
        this.currentAdmin = {
          id: null,
          name: this.adminForm.value.name,
          email: this.adminForm.value.email,
          kennwort: this.adminForm.value.pwd,
        };
      } else {
        this.currentAdmin = {
          id: this.currentAdminId,
          name: this.adminForm.value.name,
          email: this.adminForm.value.email,
          kennwort: this.currentAdminPwd,
        };
      }

      // First check what process is be done to know how and when to notify others components.
      if (
        (!this.isAdd &&
          this.adminForm.get("name").valid &&
          this.adminForm.get("email").valid) ||
        (this.isAdd &&
          this.adminForm.get("name").valid &&
          this.adminForm.get("email").valid &&
          this.adminForm.get("pwd").valid &&
          this.adminForm.get("pwd").value ===
            this.adminForm.get("pwdRepeat").value)
      ) {
        this.sharedDataService.changeCurrentAdmin(this.currentAdmin);
        // notify the parent that the form is valid
        this.notifyAdminFormValid.emit(true);
      } else {
        // notify the parent that the form is not valid
        this.notifyAdminFormValid.emit(false);
      }
    });
  }
}
