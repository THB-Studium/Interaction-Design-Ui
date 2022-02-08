import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatStepperModule } from "@angular/material/stepper";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ColorPickerModule } from 'ngx-color-picker';

import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { AdminFormComponent } from "./forms/admin-form/admin-form.component";
import { TravelerFormComponent } from './forms/traveler-form/traveler-form.component';
import { TripofferFormComponent } from './forms/tripoffer-form/tripoffer-form.component';
import { ExpectationFormComponent } from './forms/expectation-form/expectation-form.component';
import { BookingclassFormComponent } from './forms/bookingclass-form/bookingclass-form.component';
import { CountryFormComponent } from './forms/country-form/country-form.component';
import { HighlightFormComponent } from './forms/highlight-form/highlight-form.component';
import { AccommodationFormComponent } from './forms/accommodation-form/accommodation-form.component';
import { CountryInformationFormComponent } from './forms/country-information-form/country-information-form.component';
import { NavbarGuestComponent } from './navbar-guest/navbar-guest.component';
import { BookingFormComponent } from './forms/booking-form/booking-form.component';
import { FeedbackFormComponent } from './forms/feedback-form/feedback-form.component';
import { EditBookingFormComponent } from './forms/edit-booking-form/edit-booking-form.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { StarsComponent } from './stars/stars.component';
import { CurrentOffersListFormComponent } from './forms/current-offers-list-form/current-offers-list-form.component';
import { MatExpansionModule } from "@angular/material/expansion";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatStepperModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatListModule,
    NgxMatSelectSearchModule,
    ColorPickerModule,
    MatExpansionModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AdminFormComponent,
    TravelerFormComponent,
    TripofferFormComponent,
    ExpectationFormComponent,
    BookingclassFormComponent,
    CountryFormComponent,
    HighlightFormComponent,
    AccommodationFormComponent,
    CountryInformationFormComponent,
    NavbarGuestComponent,
    FeedbackFormComponent,
    BookingFormComponent,
    EditBookingFormComponent,
    SpinnerComponent,
    StarsComponent,
    CurrentOffersListFormComponent,
  ],
    exports: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        AdminFormComponent,
        TravelerFormComponent,
        TripofferFormComponent,
        ExpectationFormComponent,
        BookingclassFormComponent,
        CountryFormComponent,
        HighlightFormComponent,
        AccommodationFormComponent,
        CountryInformationFormComponent,
        NavbarGuestComponent,
        FeedbackFormComponent,
        BookingFormComponent,
        EditBookingFormComponent,
        SpinnerComponent,
        StarsComponent
    ],
})
export class ComponentsModule {}
