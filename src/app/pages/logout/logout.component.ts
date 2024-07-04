import { Component, OnInit } from '@angular/core';

import { AuthentificationService } from 'src/app/services/authentification/authentification.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  standalone: true,
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthentificationService) { }

  ngOnInit(): void {
    this.authService.logOut();
  }
}
