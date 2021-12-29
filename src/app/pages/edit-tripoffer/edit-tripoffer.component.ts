import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-tripoffer',
  templateUrl: './edit-tripoffer.component.html',
  styleUrls: ['./edit-tripoffer.component.css']
})
export class EditTripofferComponent implements OnInit {

  // Defines toolTipDuration
  toolTipDuration = 300;
  
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  navigateToTripoffersList() {
    this.router.navigate(['/tripoffers']);
  }
}
