import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { OnCommit } from "src/app/interfaces/onCommit";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
import { TravelerService } from "src/app/services/traveler/traveler.service";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Traveler } from "src/app/models/Traveler";

@Component({
  selector: 'app-traveler',
  templateUrl: './traveler.component.html',
  styleUrls: ['./traveler.component.css']
})
export class TravelerComponent implements OnInit, AfterViewInit, OnCommit {

  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = [
    "name",
    "email",
    "birthday",
    "university",
    "study",
    "adress",
    "phone",
    "workfor",
    "participated"
  ];
  // Defines dataSource
  dataSource: MatTableDataSource<Traveler>;
  // Defines travelerList
  travelerList: Traveler[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines errors
  errors = {
    errorMessage: "",
  };
  // Defines currentTraveler
  currentTraveler: Traveler;
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();

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
        id: "",
        name: "",
        vorname: "",
        adress: "",
        arbeitBei: "",
        email: "",
        geburtsdatum: "",
        hochschule: "",
        schonTeilgenommen: false,
        studiengang: "",
        telefonnummer: 0
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

  beforeSave(): void {}

  beforeUpdate(): void {}

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
      if (x.vorname > y.vorname) return 1;
      if (x.vorname < y.vorname) return -1;
      return 0;
    });
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Gets the traveler list as promise
  private getTravelerList(): Promise<Traveler[]> {
    return new Promise((resolve) => {
      this.travelerService.getAll().subscribe({
        next: (travelers: Traveler[]) => resolve(travelers),
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
  private setDataSource(travelers: Traveler[]): void {
    this.travelerList = travelers;
    this.sortByFirstname(this.travelerList);
    this.dataSource.data = this.travelerList;
  }

  // Handle the event that has been emitted by the child. Notify if the form is valid or not.
  isFormValid(isValid: boolean) {
    this.valid = isValid;
  }

  // Dialog to add new traveler
  addTravelerDialog(dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddTraveler = true;
    // clear the traveler information
    this.currentTraveler = {
      id: "",
      name: "",
      vorname: "",
      studiengang: "",
      telefonnummer: 0,
      adress: "",
      arbeitBei: "",
      email: "",
      geburtsdatum: "",
      hochschule: "",
      schonTeilgenommen: false
    };
    // set the value of the traveler into the service
    this.sharedDataService.changeCurrentTraveler(this.currentTraveler);
    // Open the add traveler dialog
    this.dialog.open(dialogForm, this.dialogConfig);
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
