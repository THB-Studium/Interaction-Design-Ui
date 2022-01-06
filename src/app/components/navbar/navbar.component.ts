import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { TokenstorageService } from 'src/app/services/tokenstorage/tokenstorage.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { SharedDataService } from 'src/app/services/sharedData/shared-data.service';

import { ROUTES } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public listTitles: any[];
  public location: Location;
  public username: string;

  constructor(
    location: Location,
    private tokenStoragService: TokenstorageService,
    private userService: AdminService,
    private sharedDataService: SharedDataService
  ) {
    this.location = location;
    // Observe the change of the username from dataservice
    this.sharedDataService.currentUser.subscribe(user => {
      this.username = `${user.surname} ${user.name}`;
    });
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.getUserName();
  }

  /**Gets and save the value of the current connected user into the shareddataservice */
  private getUserName() {
    this.userService.getAll().subscribe({
      next: (users) => {
        const currentUser = users.find(x => x.email === this.tokenStoragService.getUser().email);
        if (currentUser) {
          this.sharedDataService.changeCurrentUser(currentUser);
        }
      }
    });
  }
}
