import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import { MatSort, MatSortModule } from '@angular/material/sort';

import {FeedbackService} from 'src/app/services/feedback/feedback.service';
import {ToastrService} from 'ngx-toastr';

import {Feedback} from 'src/app/models/feedback';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, NgIf, SpinnerComponent, MatTableModule, MatSortModule, MatIconModule, MatTooltipModule, MatPaginatorModule, MatDialogModule, MatDividerModule, MatCardModule, MatButtonModule]
})
export class FeedbackComponent implements OnInit, AfterViewInit {
  // Defines paginator
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = ['author', 'description', 'status', 'action'];
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
  // Defines loading
  loading = true;
  // Defines header-img
  readonly headerImg = 'assets/img/brand/utc.PNG';
  readonly defaultFeedbackImg = './assets/img/feedback/feedback-default-img.jpg';

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
        veroeffentlich: false,
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

  commitChanges() {
    // We set the status before save it.
    this.currentFeedback.veroeffentlich = !this.currentFeedback.veroeffentlich;
    this.feedbackService.updateOne(this.currentFeedback).subscribe({
      next: (result) => {
        if (result) {
          this.currentFeedback = result;
          const idx = this.feedbackList.findIndex(x => x.id === this.currentFeedback.id);
          this.feedbackList[idx].veroeffentlich = result.veroeffentlich;
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
        if (result.bild) {
          let objectURL = 'data:image/png;base64,' + result.bild;
          row.realImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        } else {
          this.currentFeedback.realImage = null;
        }
      },
      error: () => {
        this.toastrService.error('Die Information über dieses Feedback konnte nicht geladen werden.');
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

  private getAllFeedbacks() {
    this.feedbackService.getAll().subscribe({
      next: (feedbacks) => {
        this.feedbackList = feedbacks;
        this.dataSource.data = this.feedbackList;
      },
      error: () => {
        this.toastrService.error('Die Feedbacks konnten nicht geladen werden.');
      },
      complete: () => this.loading = false
    });
  }

}
