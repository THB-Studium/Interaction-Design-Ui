import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { NewsLettersService } from "src/app/services/news-letters/news-letters.service";
import { ToastrService } from "ngx-toastr";

import { NewsLetters } from "src/app/models/newsLetters";

@Component({
  selector: "app-newsletter",
  templateUrl: "./newsletter.component.html",
  styleUrls: ["./newsletter.component.css"],
})
export class NewsletterComponent implements OnInit, AfterViewInit {
  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = ["email", "status", "action"];
  // Defines dataSource
  dataSource: MatTableDataSource<NewsLetters>;
  dialogConfig = new MatDialogConfig();
  // Defines newsletterList
  newsletterList: NewsLetters[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines loading
  loading = true;
  // Defines errors
  errors = {
    errorMessage: "",
  };
  //
  currentNewsletter: NewsLetters;
  // Defines
  public selectedOffer: FormControl;
  newsletterForm: FormGroup;

  constructor(
    private newsletterService: NewsLettersService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.dialogConfiguration();
    this.currentNewsletter = null;
    this.newsletterForm = this.fb.group({
      email: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([
      {
        id: "",
        status: true,
        email: "",
      },
    ]);

    this.newsletterList = this.dataSource.data;

    this.getNewsletterList().then((newsletters) =>
      this.setDataSource(newsletters)
    );
  }

  ngAfterViewInit(): void {
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

  // Sorts the by email descending
  sortByEmail(newsletterList: NewsLetters[]): void {
    newsletterList.sort((x, y) => {
      if (x.email < y.email) return -1;
      if (x.email > y.email) return 1;
      return 0;
    });
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Gets newsletter's list
  private getNewsletterList(): Promise<NewsLetters[]> {
    return new Promise((resolve) => {
      this.newsletterService.getAll().subscribe({
        next: (newsletters: NewsLetters[]) => resolve(newsletters),
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
  private setDataSource(newsletters: NewsLetters[]): void {
    this.newsletterList = newsletters;
    this.sortByEmail(this.newsletterList);
    this.dataSource.data = this.newsletterList;
    // set loading flag
    this.loading = false;
  }

  openEditDialog(newsletter: NewsLetters, dialogForm: any) {
    this.currentNewsletter = newsletter;
    // set the of the email in the form
    this.newsletterForm.get("email").setValue(this.currentNewsletter.email);
    // Open the add admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteDialog(newsletter: NewsLetters, dialogForm: any) {
    this.currentNewsletter = newsletter;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  /** Delete a Booking */
  deleteNewsletter() {
    this.newsletterService.deleteOne(this.currentNewsletter.id).subscribe({
      next: () => {
        const idx = this.newsletterList.findIndex(
          (x) => x.id === this.currentNewsletter.id
        );
        this.newsletterList.splice(idx, 1);
        this.sortByEmail(this.newsletterList);
        this.dataSource.data = this.newsletterList;
      },
      error: () => {
        this.toastrService.error(
          "Der Newsletter konnte nicht gelöscht werden.",
          "Fehler"
        );
      },
      complete: () =>
        this.toastrService.success(
          "Der Newsletter wurde erfolgreich gelöscht."
        ),
    });
  }

  setStatus() {
    this.currentNewsletter.status = !this.currentNewsletter.status;
    this.toastrService.info("Änderungen bitte speichern.");
  }

  updateNewsletter() {
    // set the new value of the email before save it.
    this.currentNewsletter.email = this.newsletterForm.get("email").value;
    // save the values
    this.newsletterService.updateOne(this.currentNewsletter).subscribe({
      next: (result) => {
        this.currentNewsletter = result;
        const idx = this.newsletterList.findIndex(
          (x) => x.id == this.currentNewsletter.id
        );
        this.newsletterList[idx].email = this.currentNewsletter.email;
        this.newsletterList[idx].status = this.currentNewsletter.status;
        this.sortByEmail(this.newsletterList);
        this.dataSource.data = this.newsletterList;
      },
      error: () => {
        this.toastrService.error(
          "Der Newsletter konnte nicht upgedate werden.",
          "Fehler"
        );
      },
      complete: () => {
        this.toastrService.success(
          "Der Newsletter wurde erfolgreich gespeichert."
        );
      },
    });
  }

  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }

  toMailinglist() {
    this.route.navigate(["/mailing-list"]);
  }
}
