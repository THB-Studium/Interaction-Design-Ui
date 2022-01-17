import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ClipboardModule } from "ngx-clipboard";

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
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "src/app/components/components.module";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { AdminComponent } from "../../pages/admins/admin.component";
import { BookingComponent } from "../../pages/booking/booking.component";
import { CountryComponent } from "src/app/pages/country/country.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { EditCountryComponent } from "src/app//pages/edit-country/edit-country.component";
import { TravelerComponent } from "../../pages/traveler/traveler.component";
import { TripofferComponent } from 'src/app/pages/tripoffer/tripoffer.component';
import { EditTripofferComponent } from 'src/app/pages/edit-tripoffer/edit-tripoffer.component';
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { MatChipsModule } from "@angular/material/chips";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    ClipboardModule,
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
    MatAutocompleteModule,
    MatGridListModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatListModule,
    MatExpansionModule,
    MatChipsModule
  ],
  declarations: [
    AdminComponent,
    BookingComponent,
    EditTripofferComponent,
    CountryComponent,
    DashboardComponent,
    EditCountryComponent,
    TravelerComponent,
    TripofferComponent,
    UserProfileComponent,
  ],
})
export class AdminLayoutModule {}
