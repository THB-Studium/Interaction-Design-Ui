import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { OnCommit } from "src/app/interfaces/OnCommit";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/services/admin/admin.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Admin } from "src/app/models/admin";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit, AfterViewInit, OnCommit {
  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = ["email", "name", "action"];
  // Defines dataSource
  dataSource: MatTableDataSource<Admin>;
  // Defines adminList
  adminList: Admin[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines errors
  errors = {
    errorMessage: "",
  };
  // Defines currentAdmin
  currentAdmin: Admin;
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();

  constructor(
    private adminService: AdminService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    // Datasource initialization. This is needed to set paginator and items size
    this.dataSource = new MatTableDataSource([
      { id: "", name: "Die List ist leer", email: "", kennwort: "" },
    ]);
    // define the list of admins
    this.adminList = this.dataSource.data;
    // read registered administrator from the api
    this.getAdminsList().then((admins) => {
      this.setDataSource(admins);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Filters that get and display the entered value if found.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Sorts the by name ascending
  sortByName(adminList: Admin[]): void {
    adminList.sort((x, y) => {
      if (x.name > y.name) return 1;
      if (x.name < y.name) return -1;
      return 0;
    });
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Handle the event that has been emitted by the child. Notify if the form is valid or not.
  isFormValid(isValid: boolean) {
    this.valid = isValid;
  }

  // Gets all already registered administrators as promise
  private getAdminsList(): Promise<Admin[]> {
    return new Promise((resolve) => {
      this.adminService.getAllAdmins().subscribe({
        next: (admins: Admin[]) => resolve(admins),
        error: (error) => {
          this.handleError(error);
          this.toastrService.error(
            "Die Liste konnte nicht gelesen werden.",
            "Fehler"
          );
        },
      });
    });
  }

  // Populates rows into the table
  private setDataSource(admins: Admin[]): void {
    this.adminList = admins;
    this.sortByName(this.adminList);
    this.dataSource.data = this.adminList;
  }

  // Dialog to add new admin
  addAdminDialog(dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = true;
    // clear the admin information
    this.currentAdmin = {
      id: "",
      name: "",
      email: "",
      kennwort: "",
    };
    // set the value of the admin into the service
    this.sharedDataService.changeCurrentAdmin(this.currentAdmin);
    // Open the add admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Dialog to edit an admin
  editAdminDialog(row: Admin, dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = false;
    // update current admin information
    this.currentAdmin = row;
    // set the value of the admin into the service
    this.sharedDataService.changeCurrentAdmin(this.currentAdmin);
    // Open the edit admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Get the current value of the admin from the sharedataservice.
  getCurrentAdminFromShareDataService(): void {
    this.sharedDataService.currentAdmin
      .subscribe((value) => {
        this.currentAdmin = value;
      })
      .unsubscribe();
  }

  // Gets the process to be executed (add/update) and execute it.
  commitChanges() {
    // save information
    if (this.sharedDataService.isAddBtnClicked) {
      this.beforeSave();
    } else {
      this.beforeUpdate();
    }
    // reset the status of the form to false
    this.resetFormStatus();
  }

  beforeSave(): void {
    this.getCurrentAdminFromShareDataService();
    // save
    this.getAdminsList().then((admins: Admin[]) => {
      const exists = admins.find((x) => x.email === this.currentAdmin.email);
      if (exists) {
        this.toastrService.info(
          "Bereits registrierte E-Mail",
          "Benutzer vorhanden"
        );
      } else {
        this.saveAdmin();
      }
    });
  }

  beforeUpdate(): void {
    // Need to be from the service because the information could be edited and the change is saved by the shareDataService
    this.getCurrentAdminFromShareDataService();

    this.getAdminsList().then((admins: Admin[]) => {
      const exists = admins.find(
        (x) =>
          x.email === this.currentAdmin.email && x.id !== this.currentAdmin.id
      );
      if (exists) {
        this.toastrService.info(
          "Bereits registrierte E-Mail",
          "Benutzer vorhanden"
        );
      } else {
        this.updateAdmin();
      }
    });
  }

  // Saves the form as administrator. Be sure that the information not already exists before save information.
  private saveAdmin(): void {
    this.adminService.addAdmin(this.currentAdmin).subscribe({
      next: (res: Admin) => {
        // set the current local admin
        this.currentAdmin = res;
        // Add the new added item to the current list and update the table
        this.adminList.push(res);
        this.sortByName(this.adminList);
        this.dataSource.data = this.adminList;
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentAdmin.email} konnte nicht hinzugefuegt werden.`,
          "Fehler"
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentAdmin.email} wurde erfolgreich hinzugefuegt.`
        );
      },
    });
  }

  // Saves the value of the to be updated admin.
  private updateAdmin(): void {
    this.adminService.updateAdmin(this.currentAdmin).subscribe({
      next: (res: Admin) => {
        // set the local current admin value
        this.currentAdmin = res;
        // The view need to be updated. Get the index of the updated item from the list and update the values as well.
        const itemIndex = this.adminList.findIndex((x) => x.id === res.id);
        this.adminList[itemIndex].email = res.email;
        this.adminList[itemIndex].name = res.name;
        // Update the view
        this.sortByName(this.adminList);
        this.dataSource.data = this.adminList;
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentAdmin.email} konnte nicht aktualisiert werden.`,
          "Fehler"
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentAdmin.email} wurde erfolgreich aktualisiert.`
        );
      },
    });
  }

  // Dialog for deletion process
  deleteAdminDialog(row: Admin, dialogForm: any) {
    this.currentAdmin = row;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Delete the current selected admin.
  deleteAdmin(): void {
    this.adminService.deleteAdmin(this.currentAdmin.id).subscribe({
      next: (response: string) => {
        if (response) {
          // if the value is not empty
          // Get and remove the item from the list
          const itemIndex = this.adminList.findIndex(
            (x) => x.id === this.currentAdmin.id
          );
          this.adminList.splice(itemIndex, 1);
          // Update the view
          this.dataSource.data = this.adminList;
        }
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentAdmin.email} konnte nicht entfernt werden.`,
          "Fehler"
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentAdmin.email} wurde erfolgreich entfernt.`
        );
      },
    });
  }

  // On error
  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }

  // Sets the status of the form to not valid
  resetFormStatus() {
    this.valid = false;
  }
}
