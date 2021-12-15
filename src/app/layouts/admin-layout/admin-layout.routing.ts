import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AdminComponent } from 'src/app/pages/admins/admin.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'verwaltung',    component: DashboardComponent },
    { path: 'admins',         component: AdminComponent },
    { path: 'user-profile',  component: UserProfileComponent }
];
