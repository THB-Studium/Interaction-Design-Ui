import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { OnCommit } from "src/app/interfaces/OnCommit";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/services/admin/admin.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { TokenstorageService } from "src/app/services/tokenstorage/tokenstorage.service";

import { User } from "src/app/models/user";

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
  displayedColumns: string[] = ["email", "firstname", "lastname", "action"];
  // Defines dataSource
  dataSource: MatTableDataSource<User>;
  // Defines adminList
  adminList: User[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines errors
  errors = {
    errorMessage: "",
  };
  // Defines currentAdmin
  currentAdmin: User;
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines copyEmail
  copyEmail: string;
  // Defines loading
  loading = true;

  constructor(
    private adminService: AdminService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private tokenStorageService: TokenstorageService
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    // Datasource initialization. This is needed to set paginator and items size
    this.dataSource = new MatTableDataSource([
      {
        id: "",
        name: "",
        surname: "",
        email: "",
        role: "",
        password: "",
        creationDate: null,
        updateDate: null,
      },
    ]);
    // define the list of admins
    this.adminList = this.dataSource.data;
    // read registered administrator from the api
    this.getAdminList().then((admins) => {
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

  // Sorts the by firstname ascending
  sortByFirstName(adminList: User[]): void {
    adminList.sort((x, y) => {
      if (x.surname > y.surname) return 1;
      if (x.surname < y.surname) return -1;
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
  private getAdminList(): Promise<User[]> {
    return new Promise((resolve) => {
      this.adminService.getAll().subscribe({
        next: (admins: User[]) => resolve(admins),
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
  private setDataSource(admins: User[]): void {
    this.adminList = admins;
    this.sortByFirstName(this.adminList);
    this.dataSource.data = this.adminList;
    // set loading flag
    this.loading = false;
  }

  // Dialog to add new admin
  addAdminDialog(dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = true;
    // clear the admin information
    this.currentAdmin = {
      id: "",
      name: "",
      surname: "",
      role: "",
      email: "",
      password: ""
    };
    // set the value of the admin into the service
    this.sharedDataService.changeCurrentUser(this.currentAdmin);
    // Open the add admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Dialog to edit an admin
  editAdminDialog(row: User, dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = false;
    // update current admin information
    this.currentAdmin = row;
    // save the email
    this.copyEmail = row.email;
    // set the value of the admin into the service
    this.sharedDataService.changeCurrentUser(this.currentAdmin);
    // Open the edit admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Get the current value of the admin from the sharedataservice.
  getCurrentAdminFromShareDataService(): void {
    this.sharedDataService.currentUser
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
    this.getAdminList().then((admins: User[]) => {
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

    this.getAdminList().then((admins: User[]) => {
      const exists = admins.find(
        (x) =>
          x.email === this.currentAdmin.email && x.id !== this.currentAdmin.id
      );
      if (
        exists &&
        this.currentAdmin.email.toLowerCase() !== this.copyEmail.toLowerCase()
      ) {
        this.toastrService.info(
          `Bereits registrierte E-Mail - ${this.currentAdmin.email}`,
          "Benutzer vorhanden"
        );
      } else {
        this.updateAdmin();
      }
    });
  }

  // Saves the form as administrator. Be sure that the information not already exists before save information.
  private saveAdmin(): void {
    this.adminService.addOne(this.currentAdmin).subscribe({
      next: (res: User) => {
        // set the current local admin
        this.currentAdmin = res;
        // Add the new added item to the current list and update the table
        this.adminList.push(res);
        this.sortByFirstName(this.adminList);
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
    const updatedValue = {
      id: this.currentAdmin?.id,
      name: this.currentAdmin?.name,
      surname: this.currentAdmin?.surname,
      email:
        this.currentAdmin?.email != this.copyEmail
          ? this.currentAdmin?.email
          : null,
    };

    this.adminService.updateOne(updatedValue).subscribe({
      next: (res: User) => {
        // set the local current admin value
        this.currentAdmin = res;
        // The view need to be updated. Get the index of the updated item from the list and
        // update the values as well.
        const itemIndex = this.adminList.findIndex((x) => x.id === res.id);
        this.adminList[itemIndex].email = res.email;
        this.adminList[itemIndex].name = res.name;
        this.adminList[itemIndex].surname = res.surname;
        // Update the view
        this.sortByFirstName(this.adminList);
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
  deleteAdminDialog(row: User, dialogForm: any) {
    this.currentAdmin = row;
    // A user can not delete it self
    if (this.currentAdmin.email !== this.tokenStorageService.getUser().email) {
      this.dialog.open(dialogForm, this.dialogConfig);
    } else {
      this.toastrService.info(
        "Diese Aktion kann nicht ausgeführt werden. Melden Sie sich mit einem anderen Konto an, um die Aktion ausführen zu können."
      );
    }
  }

  // Delete the current selected admin.
  deleteAdmin(): void {
    this.adminService.deleteOne(this.currentAdmin.id).subscribe({
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
    console.log(error);
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }

  // Sets the status of the form to not valid
  resetFormStatus() {
    this.valid = false;
  }
}
