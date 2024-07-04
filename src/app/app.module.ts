import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ToastrModule} from 'ngx-toastr';

import {AppComponent} from './app.component';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {HomeLayoutComponent} from './layouts/home-layout/home-layout.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxWebstorageModule} from 'ngx-webstorage';

import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {ScrollToTopComponent} from './components/scroll-to-top/scroll-to-top.component';

registerLocaleData(localeDe, localeDeExtra);

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ComponentsModule,
        NgbModule,
        RouterModule,
        AppRoutingModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
        NgxWebstorageModule.forRoot(),
        AdminLayoutComponent,
        AuthLayoutComponent,
        HomeLayoutComponent,
        ScrollToTopComponent,
    ],
    declarations: [AppComponent],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LOCALE_ID, useValue: 'de' },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
