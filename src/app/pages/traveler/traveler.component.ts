import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { MatSort, MatSortModule } from '@angular/material/sort';

import {ToastrService} from 'ngx-toastr';
import {TravelerService} from 'src/app/services/traveler/traveler.service';
import {SharedDataService} from 'src/app/services/sharedData/shared-data.service';

import {Traveler} from 'src/app/models/traveler';
import {Calendar} from 'src/app/variables/calendar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TravelerFormComponent } from '../../components/forms/traveler-form/traveler-form.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-traveler',
    templateUrl: './traveler.component.html',
    styleUrls: ['./traveler.component.css'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        NgIf,
        SpinnerComponent,
        MatTableModule,
        MatSortModule,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        MatPaginatorModule,
        MatDialogModule,
        MatDividerModule,
        TravelerFormComponent,
        FormsModule,
    ],
})
export class TravelerComponent implements OnInit, AfterViewInit {
  // Defines paginator
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = [
    'name',
    'email',
    'university',
    'study',
    'participated',
    'action',
  ];
  // Defines dataSource
  dataSource: MatTableDataSource<Traveler>;
  // Defines travelerList
  travelerList: Traveler[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines errors
  errors = {
    errorMessage: '',
  };
  // Defines currentTraveler
  currentTraveler: Traveler;
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines loading
  loading = true;

  constructor(
    private travelerService: TravelerService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.dialogConfiguration();
  }

  ngOnInit(): void {
    // Datasource initialization. This is needed to set paginator and items size
    this.dataSource = new MatTableDataSource([
      {
        id: '',
        name: '',
        vorname: '',
        adresse: '',
        arbeitBei: '',
        email: '',
        geburtsdatum: null,
        hochschule: '',
        schonTeilgenommen: false,
        studiengang: '',
        telefonnummer: '',
        status: '',
      },
    ]);

    // define the list of travelers
    this.travelerList = this.dataSource.data;

    // read travelers from the api
    this.getTravelerList().then((travelers) => {
      this.setDataSource(travelers);
    });
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

  // Sorts the by date ascending
  sortByFirstname(travelerList: Traveler[]): void {
    travelerList.sort((x, y) => {
      if (x.vorname > y.vorname) {
        return 1;
      }
      if (x.vorname < y.vorname) {
        return -1;
      }
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

  // Get the current value of the traveler from the sharedataservice.
  getCurrentTravelerFromSharedDataService(): void {
    this.sharedDataService.currentTraveler
      .subscribe((value) => {
        this.currentTraveler = value;
      })
      .unsubscribe();
  }

  // Gets object of type date and return a string
  convertDateToString(date: string) {
    if (date && date.includes('-')) {
      const day = parseInt(date.split('-')[2]);
      const month = parseInt(date.split('-')[1]);
      const year = parseInt(date.split('-')[0]);
      return `${day} ${Calendar.months[month - 1]} ${year}`;
    }
    return '';
  }

  commitChanges() {
    // First read and save the current information from the data service
    this.getCurrentTravelerFromSharedDataService();
    // save information
    if (this.sharedDataService.isAddBtnClicked) {
      this.saveTraveler();
    } else {
      this.updateTraveler();
    }
    // reset the status of the form to false
    this.resetFormStatus();
  }

  // Dialog to add new traveler
  addTravelerDialog(dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = true;
    // clear the traveler information
    this.currentTraveler = {
      id: '',
      name: '',
      vorname: '',
      studiengang: '',
      telefonnummer: '',
      adresse: '',
      arbeitBei: '',
      email: '',
      geburtsdatum: null,
      hochschule: '',
      schonTeilgenommen: false,
      status: '',
    };
    // set the value of the traveler into the service
    this.sharedDataService.changeCurrentTraveler(this.currentTraveler);
    // Open the add traveler dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Dialog to edit an Traveler
  editTravelerDialog(row: Traveler, dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = false;
    // update current Traveler information
    this.travelerService.getOne(row.id).subscribe({
      next: (result) => {
        this.currentTraveler = result;
      },
      error: () => (this.currentTraveler = row),
      complete: () => {
        // set the value of the Traveler into the service
        this.sharedDataService.changeCurrentTraveler(this.currentTraveler);
        // Open the edit Traveler dialog
        this.dialog.open(dialogForm, this.dialogConfig);
      },
    });
  }

  // delete dialog
  deleteTravelerDialog(row: Traveler, dialogForm: any) {
    this.currentTraveler = row;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  // Delete the current selected Traveler.
  deleteTraveler(): void {
    this.travelerService.deleteOne(this.currentTraveler.id).subscribe({
      next: (response: string) => {
        if (response) {
          // if the value is not empty
          // Get and remove the item from the list
          const itemIndex = this.travelerList.findIndex(
            (x) => x.id === this.currentTraveler.id
          );
          this.travelerList.splice(itemIndex, 1);
          // Update the view
          this.dataSource.data = this.travelerList;
        }
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentTraveler.email} konnte nicht entfernt werden.`,
          'Fehler'
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentTraveler.email} wurde erfolgreich entfernt.`
        );
      },
    });
  }

  dialogDetails(row: Traveler, dialogForm: any) {
    this.travelerService.getOne(row.id).subscribe({
      next: (result) => {
        this.currentTraveler = result;
      },
      error: () => (this.currentTraveler = row),
      complete: () => {
        // set the value of the Traveler into the service
        this.sharedDataService.changeCurrentTraveler(this.currentTraveler);
        // Open the edit Traveler dialog
        this.dialog.open(dialogForm, this.dialogConfig);
      },
    });
  }

  // Sets the status of the form to not valid
  resetFormStatus() {
    this.valid = false;
  }

  getPhoneNumber(traveler: Traveler): string {
    return !traveler.telefonnummer.includes('+') ? `+${traveler.telefonnummer}` : `${traveler.telefonnummer}`;
  }

  // Gets the traveler list as promise
  private getTravelerList(): Promise<Traveler[]> {
    return new Promise((resolve) => {
      this.travelerService.getAll().subscribe({
        next: (travelers: Traveler[]) => resolve(travelers),
        error: (error) => {
          this.handleError(error);
          this.toastrService.error(
            'Die Liste konnte nicht gelesen werden.',
            'Fehler'
          );
        },
      });
    });
  }

  // Populates rows into the table
  private setDataSource(travelers: Traveler[]): void {
    this.travelerList = travelers;
    this.sortByFirstname(this.travelerList);
    this.dataSource.data = this.travelerList;
    // set loading flag
    this.loading = false;
  }

  // Saves the form as new traveler.
  private saveTraveler(): void {
    this.travelerService.addOne(this.currentTraveler).subscribe({
      next: (res: Traveler) => {
        // set the current local traveler
        this.currentTraveler = res;
        // Add the new added item to the current list and update the table
        this.travelerList.push(res);
        this.sortByFirstname(this.travelerList);
        this.dataSource.data = this.travelerList;
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentTraveler.email} konnte nicht hinzugefuegt werden.`,
          'Fehler'
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentTraveler.email} wurde erfolgreich hinzugefuegt.`
        );
      },
    });
  }

  // Saves the value of the to be updated Traveler.
  private updateTraveler(): void {
    this.travelerService.updateOne(this.currentTraveler).subscribe({
      next: (res: Traveler) => {
        // set the local current Traveler value
        this.currentTraveler = res;
        // The view need to be updated. Get the index of the updated item from the list and update the values as well.
        const itemIndex = this.travelerList.findIndex((x) => x.id === res.id);
        this.travelerList[itemIndex].vorname = res.vorname;
        this.travelerList[itemIndex].name = res.name;
        this.travelerList[itemIndex].adresse = res.adresse;
        this.travelerList[itemIndex].arbeitBei = res.arbeitBei;
        this.travelerList[itemIndex].email = res.email;
        this.travelerList[itemIndex].geburtsdatum = res.geburtsdatum;
        this.travelerList[itemIndex].hochschule = res.hochschule;
        this.travelerList[itemIndex].studiengang = res.studiengang;
        this.travelerList[itemIndex].telefonnummer = res.telefonnummer;
        this.travelerList[itemIndex].schonTeilgenommen = res.schonTeilgenommen;
        this.travelerList[itemIndex].status = res.status;

        // Update the view
        this.sortByFirstname(this.travelerList);
        this.dataSource.data = this.travelerList;
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentTraveler.email} konnte nicht aktualisiert werden.`,
          'Fehler'
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentTraveler.email} wurde erfolgreich aktualisiert.`
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
}
