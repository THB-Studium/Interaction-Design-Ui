import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import { DomSanitizer } from "@angular/platform-browser";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { FeedbackService } from "src/app/services/feedback/feedback.service";
import { ToastrService } from "ngx-toastr";

import { Feedback } from "src/app/models/feedback";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, AfterViewInit {
  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = ["author", "description", "status", "action"];
  // Defines dataSource
  dataSource: MatTableDataSource<Feedback>;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines adminList
  feedbackList: Feedback[] = [];
  // Defines currentFeedback
  currentFeedback: Feedback;
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines header-img
  readonly headerImg = "assets/img/brand/utc.PNG";
  readonly defaultFeedbackImg = "./assets/img/feedback/feedback-default-img.jpg";

  constructor(
    private dialog: MatDialog,
    private feedbackService: FeedbackService,
    private sanitizer: DomSanitizer,
    private toastrService: ToastrService
  ) {
    this.dialogConfiguration();
    // Datasource initialization. This is needed to set paginator and items size
    this.dataSource = new MatTableDataSource([
      {
        id: '',
        autor: '',
        bild: '',
        description: '',
        veroefentlich: false,
        realImage: ''
      },
    ]);
  }

  ngOnInit(): void {
    // define the list of admins
    this.feedbackList = this.dataSource.data;
    // Get the list of feedbacks
    this.getAllFeedbacks();
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

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  private getAllFeedbacks() {
    this.feedbackService.getAll().subscribe({
      next: (feedbacks) => {
        this.feedbackList = feedbacks;
        this.dataSource.data = this.feedbackList;
      },
      error: () => {
        this.toastrService.error('Die Feedbacks konnten nicht geladen werden.');
      }
    });
  }

  commitChanges() {
    // We set the status before save it.
    this.currentFeedback.veroefentlich = !this.currentFeedback.veroefentlich;
    this.feedbackService.updateOne(this.currentFeedback).subscribe({
      next: (result) => {
        if (result) {
          this.currentFeedback = result;
          const idx = this.feedbackList.findIndex(x => x.id === this.currentFeedback.id);
          this.feedbackList[idx].veroefentlich = result.veroefentlich;
          this.dataSource.data = this.feedbackList;
        }
      },
      error: () => {
        this.toastrService.error('Die Änderungen konnten nicht gespeichert werden.');
      },
      complete: () => {
        this.toastrService.success('Die Änderungen wurden erfolgreich gespeichert.');
      }
    });
  }

  editDialog(row: Feedback, dialogForm: any) {
    this.feedbackService.getOne(row.id).subscribe({
      next: (result) => {
        //convert image
        if(result.bild) {
          let objectURL = "data:image/png;base64," + result.bild;
          row.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        } else {
          this.currentFeedback.realImage = null;
        }
      },
      error: () => {
        this.toastrService.error("Die Information über dieses Feedback konnte nicht geladen werden.");
      },
      complete: () => {
        this.currentFeedback = row;
        // Open the edit admin dialog
        this.dialog.open(dialogForm, this.dialogConfig);
      }
    });
  }

  deleteDialog(row: Feedback, dialogForm: any) {
    this.currentFeedback = row;
    // Open the edit admin dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteFeedback() {
    this.feedbackService.deleteOne(this.currentFeedback.id).subscribe({
      next: () => {
        const idx = this.feedbackList.findIndex(x => x.id === this.currentFeedback.id);
        this.feedbackList.splice(idx, 1);
        this.dataSource.data = this.feedbackList;
      },
      error: () => {
        this.toastrService.error('Das Feedback konnte nicht gelöscht werden.');
      },
      complete: () => {
        this.toastrService.success(`Das Feedback von ${this.currentFeedback.autor} wurde erfolgreich gelöscht.`);
      }
    });
  }

  extractDescription(text: string): string {
    return text.length > 40 ? `${text.substring(0, 39)}...` : text;
  }

}
