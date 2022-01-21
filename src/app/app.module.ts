import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

<<<<<<< HEAD
//import { AppHttpInterceptor } from './services/httpInterceptor/app-http.interceptor';
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { AppHttpInterceptor } from "./services/httpInterceptor/app-http.interceptor";
=======
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
>>>>>>> dev

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxWebstorageModule } from "ngx-webstorage";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
<<<<<<< HEAD
import { AboutusComponent } from "./pages/aboutus/aboutus.component";
=======
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
>>>>>>> dev

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
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
    NgxWebstorageModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    AboutusComponent,
  ],
  providers: [
    //{ provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
