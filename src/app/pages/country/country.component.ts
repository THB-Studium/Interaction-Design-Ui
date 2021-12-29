import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { CountryService } from "src/app/services/country/country.service";
import { ToastrService } from "ngx-toastr";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

import { Country } from "src/app/models/country";

@Component({
  selector: "app-country",
  templateUrl: "./country.component.html",
  styleUrls: ["./country.component.css"],
})
export class CountryComponent implements OnInit, AfterViewInit {
  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = ["name", "airports", "accommodation", "action"];
  // Defines dataSource
  dataSource: MatTableDataSource<Country>;
  // Defines countriesList
  countriesList: Country[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines errors
  errors = {
    errorMessage: "",
  };
  // Defines currentCountry
  currentCountry: Country;
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  //
  isValid = false;
  image: any;

  dummy = [
    {
      id: "1",
      name: "Kamerun",
      flughafen: ["Douala", "Yaounde"],
      unterkunft_text: "Text for the accommodation"
    }
  ];

  constructor(
    private countryService: CountryService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dialogConfiguration();
    // Initialization
    this.currentCountry = {
      id: "",
      name: "",
      flughafen: [],
      unterkunft_text: "",
    };
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.getCountries();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  // Filters that get and display the entered value if found.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Sorts by name ascending
  sortByName(countries: Country[]): void {
    countries.sort((x, y) => {
      if (x.name > y.name) return 1;
      if (x.name < y.name) return -1;
      return 0;
    });
  }

  private getCountries() {
    this.countriesList = this.dummy;
    this.sortByName(this.countriesList);
    this.dataSource.data = this.countriesList;
    /*this.countryService.getAll().subscribe({
      next: (countries) => {
        this.countriesList = countries;
        this.sortByName(this.countriesList);
        this.dataSource.data = this.countriesList;
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `Die Länder konnten nicht geladen werden.`,
          "Fehler"
        );
      },
    });*/
  }

  isModalFormValid(value: boolean) {
    this.isValid = value;
  }

  AddNewCountryDialog(dialogForm: any) {
    // set the value of the country into the service
    this.sharedDataService.changeCurrentCountry(this.currentCountry);
    // Open the add country dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  saveNewCountry() {
    // get the value from the data service
    this.sharedDataService.currentCountry.subscribe((val) => {
      this.countryService.addOne(val).subscribe({
        next: (resp) => {
          this.currentCountry = resp;
          // Add the new added item to the current list and update the table
          this.countriesList.push(resp);
          this.sortByName(this.countriesList);
          this.dataSource.data = this.countriesList;
        },
        error: (err) => {
          this.handleError(err);
          this.toastrService.error(
            `Das Land konnte nicht gespeichert werden.`,
            "Fehler"
          );
        },
        complete: () => {
          this.toastrService.success(
            `${this.currentCountry.name} wurde erfolgreich hinzugefuegt.`
          );
        },
      });
    });
    // set the flag to false
    this.isValid = false;
  }

  // edit any country
  editCountry(country: Country) {
    this.sharedDataService.isAddBtnClicked = false;
    this.sharedDataService.changeCurrentCountry(country);
    this.router.navigate([`edit/${country.id}`], { relativeTo: this.route });
  }

  deleteCountryDialog(country: Country, dialogForm: any) {
    this.currentCountry = country;
    this.dialog.open(dialogForm, this.dialogConfig);
  } 

  // Delete country from the entries
  deleteCountry() {
    this.countryService.deleteOne(this.currentCountry.id).subscribe({
      next: (response: string) => {
        if (response) {
          // Get and remove the item from the list
          const itemIndex = this.countriesList.findIndex(
            (x) => x.id === this.currentCountry.id
          );
          this.countriesList.splice(itemIndex, 1);
          // Update the view
          this.dataSource.data = this.countriesList;
        }
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentCountry.name} konnte nicht entfernt werden.`,
          "Fehler"
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentCountry.name} wurde erfolgreich entfernt.`
        );
      }
    });
  }

  // On error
  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }
}
