import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";


import { AdminService } from "src/app/services/admin/admin.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Admin } from "src/app/models/Admin";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ["email", "name", "action"];
  dataSource: MatTableDataSource<Admin>;
  adminList: Admin[] = [];
  total = 0;
  toolTipDuration = 300;
  errors = {
    errorMessage: "",
  };
  currentAdmin: Admin;
  valid: boolean = false;

  dialogConfig = new MatDialogConfig();

  constructor(
    private adminService: AdminService,
    private sharedDataService: SharedDataService,
    public dialog: MatDialog
  ) {
    this.configDialog();
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.getAdminsList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Calls for input filtering. Display the entered value if found, otherwise we notify that the input could not be found.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Dialog configurations
  configDialog() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Handle the event that has been emitted by the child. Notify if the form is valid or not.
  isFormValid(isValid: boolean) {
    this.valid = isValid;
  }

  // Calls this method to read all already registered administrators.
  private getAdminsList(): void {
    this.adminList = [];
    this.adminService.getAllAdmins().subscribe({
      next: (admins) => {
        this.dataSource = new MatTableDataSource(admins);
        this.adminList = admins;
        this.total = admins.length;
      },
      error: (err) => this.handleError(err),
      complete: () => {
        console.log("Completed!");
      },
    });
  }

  // Calls to read the value of the current admin from the sharedataservice
  private readCurrentAdminFromTheService(): void {
    this.sharedDataService.currentAdmin
      .subscribe((value) => {
        this.currentAdmin = value;
      })
      .unsubscribe();
  }

  // Dialog to add new admin
  addAdminDialog(dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddAdmin = true;
    // clear the admin information
    this.currentAdmin = {
      id: "",
      name: "",
      email: "",
      kennwort: "",
    };
    this.sharedDataService.changeCurrentAdmin(this.currentAdmin);
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Dialog to edit an admin
  editAdminDialog(row: Admin, dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddAdmin = false;
    // update current admin information
    this.currentAdmin = row;
    this.sharedDataService.changeCurrentAdmin(this.currentAdmin);
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Calls to add new admin to the list of administrator.
  // The new added admin will be able to log-in and administrate the complete page.
  saveAdmin(): void {
    this.adminService.addAdmin(this.currentAdmin).subscribe({
      next: (response) => {
        this.dataSource.data.push(response);
        this.adminList.push(response);
        this.total = this.adminList.length;
      },
      error: (err) => this.handleError(err),
      complete: () => {
        console.log("New Admin added");
      },
    });
  }

  // Calls to update any admin. This will change the admin information
  private updateAdmin(): void {
    this.adminService.updateAdmin(this.currentAdmin).subscribe({
      next: (response) => {
        console.log("Update" + response);
      },
      error: (err) => this.handleError(err),
      complete: () => {
        console.log("Update success");
      },
    });
  }

  // Calls to save change. Handle add and edit process.
  applyChange() {
    // Get and save the current value of the before applying the changes
    this.readCurrentAdminFromTheService();
    // save information
    if (this.sharedDataService.isAddAdmin) {
      this.saveAdmin();
    } else {
      this.updateAdmin();
    }
    this.dataSource._updateChangeSubscription();
  }

  // Dialog for deletion process
  deleteAdminDialog(row: Admin, dialogForm: any) {
    this.currentAdmin = row;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Calls to delete any admin. The admin will be removed from the list of administrator into the DB.
  deleteAdmin(): void {
    this.adminService.deleteAdmin(this.currentAdmin.id).subscribe({
      next: (response) => {
        console.log("Successful deleted");
        console.log(response);
      },
      error: (err) => this.handleError(err),
      complete: () => {
        console.log("Successful deleted");
      }
    });
  }

  // On error
  private handleError(err: any) {
    if (err?.error?.message) {
      this.errors.errorMessage = err?.error?.message;
    }
    console.error(err);
  }

  resetFlag() {
    this.valid = false;
  }
}
