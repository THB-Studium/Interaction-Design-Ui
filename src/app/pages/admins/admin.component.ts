import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
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
    private dialog: MatDialog,
    private toastrService: ToastrService
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

  // Gets all already registered administrators.
  private getAdminsList(): void {
    this.adminList = [];
    this.adminService.getAllAdmins().subscribe({
      next: (admins) => {
        this.dataSource = new MatTableDataSource(admins);
        this.adminList = admins;
        this.total = admins.length;
      },
      error: (error) => this.handleError(error)
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
      next: (res: Admin) => {
        // Add the new added item to the current list and update the table
        this.adminList.push(res);
        this.dataSource.connect().next(this.adminList);
        // Update the amount
        this.total = this.adminList.length;
        // Update current admin
        this.currentAdmin = res;
      },
      error: (err) => this.handleError(err),
      complete: () => {
        this.toastrService.success(`${this.currentAdmin.email} wurde erfolgreich hinzugefuegt.`);
      },
    });
  }

  // Saves the value of the to be updated admin.
  private updateAdmin(): void {
    this.adminService.updateAdmin(this.currentAdmin).subscribe({
      next: (res: Admin) => {
        // The table need to be updated. we search and update the item into the the list
        const itemIndex = this.adminList.findIndex(x => x.id === res.id);
        this.adminList[itemIndex].email = res.email;
        this.adminList[itemIndex].name = res.name;
        // Update the view
        this.dataSource.connect().next(this.adminList);
        this.currentAdmin = res;
        this.toastrService.success(`${this.currentAdmin.email} wurde erfolgreich geaendert.`);
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

  // Delete the selected admin.
  deleteAdmin(): void {
    this.adminService.deleteAdmin(this.currentAdmin.id).subscribe({
      next: (response: string) => {
        if (response) {// if the value is not empty
          // Get and remove the item from the list
          const itemIndex = this.adminList.findIndex(x => x.id === this.currentAdmin.id);
          this.adminList.splice(itemIndex, 1);
          // Update the view
          this.dataSource.connect().next(this.adminList);
        }
      },
      error: (err) => this.handleError(err),
      complete: () => {
        this.toastrService.success(`${this.currentAdmin.email} wurde erfolgreich entfernt.`);
      }
    });
  }

  // On error
  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
    console.error(error);
  }

  resetFlag() {
    this.valid = false;
  }
}
