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
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css']
})
export class CountriesListComponent implements OnInit, AfterViewInit {

  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = [
    "img",
    "name",
    "airports",
    "highlights",
    "accommodation",
    "action"
  ];
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

  constructor(
    private countryService: CountryService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dialogConfiguration();
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
    this.countryService.getAll().subscribe({
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
      }
    });
  }

  // On error
  private handleError(error: any) {
    if (error?.message) {
      this.errors.errorMessage = error?.message;
    }
  }

  navigateToAddView() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

}
