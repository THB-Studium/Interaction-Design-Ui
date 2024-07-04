import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {HomeLayoutRoutes} from './home-layout.routing';
import {ComponentsModule} from '../../components/components.module';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';

import {HomeComponent} from 'src/app/pages/home/home.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(HomeLayoutRoutes),
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        ComponentsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatBadgeModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatDialogModule,
        MatExpansionModule,
        HomeComponent
    ],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class HomeLayoutModule {
}
