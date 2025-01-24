import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {provideNgxWebstorage} from 'ngx-webstorage';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      FormsModule, NgbModule
    ),
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'de'},
    provideRouter(routes),
    provideAnimations(),
    provideNgxWebstorage(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ]
};
