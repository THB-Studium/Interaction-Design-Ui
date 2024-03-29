import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { Calendar } from "src/app/variables/calendar";
import { TripOffer } from "src/app/models/tripOffer";
import { SharedDataService } from "src/app/services/sharedData/shared-data.service";
import { ToastrService } from "ngx-toastr";
import { TripOfferService } from "src/app/services/trip-offer/trip-offer.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tripoffer",
  templateUrl: "./tripoffer.component.html",
  styleUrls: ["./tripoffer.component.css"],
})
export class TripofferComponent implements OnInit, AfterViewInit {
  // Defines paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // Defines sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Defines displayedColumns
  displayedColumns: string[] = [
    "img",
    "title",
    "date",
    "place",
    "freeplace",
    "action",
  ];
  // Defines dataSource
  dataSource: MatTableDataSource<TripOffer>;
  // Defines tripOfferList
  tripOfferList: TripOffer[] = [];
  // Defines toolTipDuration
  toolTipDuration = 300;
  // Defines errors
  errors = {
    errorMessage: "",
  };
  // Defines currentTripOffer
  currentTripOffer: TripOffer;
  // Defines valid. The value is true if the form is valid.
  valid: boolean = false;
  // Defines dialogConfig
  dialogConfig = new MatDialogConfig();
  // Defines loading
  loading = true;

  constructor(
    private tripOfferService: TripOfferService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.dialogConfiguration();
    this.currentTripOffer = {
      id: "",
      titel: "",
      anmeldungsFrist: "",
      startDatum: "",
      endDatum: "",
      startbild: null,
      plaetze: 0,
      freiPlaetze: 0,
      interessiert: 0,
      leistungen: [],
      mitreiseberechtigt: [],
      hinweise: "",
      sonstigeHinweise: "",
      landId: "",
      buchungsklassenReadListTO: null,
      erwartungenReadListTO: null,
      erwartungen: null,
      buchungsklassen: null,
    };
  }

  ngOnInit(): void {
    // Datasource initialization. This is needed to set paginator and items size
    this.dataSource = new MatTableDataSource([
      {
        id: "",
        titel: "",
        anmeldungsFrist: null,
        startDatum: null,
        endDatum: null,
        startbild: null,
        plaetze: 0,
        freiPlaetze: 0,
        interessiert: 0,
        leistungen: [],
        mitreiseberechtigt: [],
        hinweise: "",
        sonstigeHinweise: "",
        landId: "",
        buchungsklassenReadListTO: null,
        erwartungenReadListTO: null,
        erwartungen: null,
        buchungsklassen: null,
      },
    ]);

    // define the list of tripoffers
    this.tripOfferList = this.dataSource.data;

    // read tripoffers from the api
    this.getTripoffers();
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
  sortByTitle(tripOfferList: TripOffer[]): void {
    tripOfferList.sort((x, y) => {
      if (x.titel > y.titel) return 1;
      if (x.titel < y.titel) return -1;
      return 0;
    });
  }

  // Dialog configurations
  dialogConfiguration() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  private getTripoffers() {
    this.tripOfferService.getAll().subscribe({
      next: (offers) => {
        this.tripOfferList = offers;
        this.sortByTitle(this.tripOfferList);
        this.dataSource.data = this.tripOfferList.map((tripOffer) => {
          //convert image
          let objectURL = "data:image/png;base64," + tripOffer.startbild;
          tripOffer.realImage =
            this.sanitizer.bypassSecurityTrustUrl(objectURL);
          return tripOffer;
        });
      },
      error: (error) => {
        this.handleError(error);
        this.toastrService.error(
          "Die Liste von Angeboten konnte nicht gelesen werden.",
          "Fehler"
        );
      },
      complete: () => this.loading = false
    });
  }

  // Handle the event that has been emitted by the child. Notify if the form is valid or not.
  isFormValid(isValid: boolean) {
    this.valid = isValid;
  }

  addOffersDialog(dialogForm: any) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = true;
    // set the value of the offer into the service
    this.sharedDataService.changeCurrentTripOffer(this.currentTripOffer);
    // Open the add traveler dialog
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  commitChanges() {
    // read value to be saved from the data service
    this.sharedDataService.currenttripOfferSource
      .subscribe({
        next: (tripoffer) => {
          let tocreate = {
            id: tripoffer.id,
            titel: tripoffer.titel,
            startDatum: tripoffer.startDatum,
            endDatum: tripoffer.endDatum,
            anmeldungsFrist: tripoffer.anmeldungsFrist,
            plaetze: tripoffer.plaetze,
            freiPlaetze: tripoffer.freiPlaetze,
            leistungen: tripoffer.leistungen,
            interessiert: tripoffer.interessiert,
            mitReiserBerechtigt: tripoffer.mitreiseberechtigt,
            hinweise: tripoffer.hinweise,
            sonstigeHinweise: tripoffer.sonstigeHinweise,
            erwartungenReadListTO: tripoffer.erwartungenReadListTO,
            buchungsklassenReadListTO: tripoffer.buchungsklassenReadListTO,
            landId: tripoffer.landId,
            startbild: tripoffer.startbild,
          };

          this.tripOfferService.addOne(tocreate).subscribe({
            next: (res: TripOffer) => {
              // set the current local tripoffer
              this.currentTripOffer = res;
              // Add the new added item to the current list and update the table
              this.tripOfferList.push(res);
              this.sortByTitle(this.tripOfferList);
              this.dataSource.data = this.tripOfferList.map((tripOffer) => {
                //convert image
                let objectURL = "data:image/png;base64," + tripOffer.startbild;
                tripOffer.realImage =
                  this.sanitizer.bypassSecurityTrustUrl(objectURL);
                return tripOffer;
              });
            },
            error: (err) => {
              this.handleError(err);
              this.toastrService.error(
                `${this.currentTripOffer.titel} konnte nicht hinzugefuegt werden.`,
                "Fehler"
              );
            },
            complete: () => {
              this.toastrService.success(
                `${this.currentTripOffer.titel} wurde erfolgreich hinzugefuegt.`
              );

              this.router.navigate(['/tripoffers/edit', this.currentTripOffer.id]);
            },
          });
        },
      })
      .unsubscribe();
    //
    this.valid = false;
  }

  editTripofferDialog(tripoffer: TripOffer) {
    // Notify the sharedataservice that it is an add
    this.sharedDataService.isAddBtnClicked = false;
    // update current Traveler information
    this.currentTripOffer = tripoffer;
    // navigate to the edit page
    this.router.navigate([`edit/${tripoffer.id}`], {
      relativeTo: this.activatedRoute,
    });
  }

  deleteTripofferDialog(tripoffer: TripOffer, dialogForm: any) {
    this.currentTripOffer = tripoffer;
    this.dialog.open(dialogForm, this.dialogConfig);
  }

  deleteTripOffer() {
    this.tripOfferService.deleteOne(this.currentTripOffer.id).subscribe({
      next: (response: string) => {
        if (response) {
          // Get and remove the item from the list
          const itemIndex = this.tripOfferList.findIndex(
            (x) => x.id === this.currentTripOffer.id
          );
          this.tripOfferList.splice(itemIndex, 1);
          // Update the view
          this.dataSource.data = this.tripOfferList;
        }
      },
      error: (err) => {
        this.handleError(err);
        this.toastrService.error(
          `${this.currentTripOffer.titel} konnte nicht entfernt werden.`,
          "Fehler"
        );
      },
      complete: () => {
        this.toastrService.success(
          `${this.currentTripOffer.titel} wurde erfolgreich entfernt.`
        );
      },
    });
  }

  viewOffer(row: TripOffer) {
    this.router.navigate(['tripoffer/view', row.id]);
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

  convertDateToString(date: string) {
    if (date && date.includes("-")) {
      const day = parseInt(date.split("-")[2]);
      const month = parseInt(date.split("-")[1]);
      const year = parseInt(date.split("-")[0]);
      return `${day} ${Calendar.months[month - 1]} ${year}`;
    }
    return "";
  }
}
