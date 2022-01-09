import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-guest',
  templateUrl: './navbar-guest.component.html',
  styleUrls: ['./navbar-guest.component.css']
})
export class NavbarGuestComponent implements OnInit {

  public listTitles: any[];
  public location: Location;

  public isCollapsed = true;

  public isAuth = false;

  private title = '';

  constructor(location: Location, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    this.title = this.location.prepareExternalUrl(this.location.path());
    if (this.title.charAt(0) === '#') {
      this.title = this.title.slice(1);
    }

    if (this.title.toLowerCase().includes('login') || this.title.toLowerCase().includes('register')) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  /**Change navbar backgroung on scroll */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (this.title.includes('home')) {
      let element = document.querySelector('.navbar');
      if (window.pageYOffset > element.clientHeight) {
        element.classList.add('bg-auth');
      } else {
        element.classList.remove('bg-auth');
      }
    }
  }
}
