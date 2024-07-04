import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {routes} from './app.routes';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {useHash: false}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
