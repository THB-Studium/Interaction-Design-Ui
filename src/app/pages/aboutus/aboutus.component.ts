import { Component, OnDestroy, OnInit } from "@angular/core";

import { SharedDataService } from "src/app/services/sharedData/shared-data.service";

@Component({
    selector: "app-aboutus",
    templateUrl: "./aboutus.component.html",
    styleUrls: ["./aboutus.component.css"],
    standalone: true,
})
export class AboutusComponent implements OnInit, OnDestroy {
  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    // reset footer background color
    this.sharedDataService.changeCurrentBackgroundColors({
      header: '',
      bodyAndFooter: '',
    });
  }

  ngOnDestroy(): void {
    // Reset the color
    this.sharedDataService.changeCurrentBackgroundColors({
      header: '',
      bodyAndFooter: '',
    });
  }
}
