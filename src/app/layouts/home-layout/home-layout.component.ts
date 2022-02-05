import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Slide } from "src/app/models/slide";
import { SlideList } from "src/app/shared/datas/slideList";

@Component({
  selector: "app-home-layout",
  templateUrl: "./home-layout.component.html",
  styleUrls: ["./home-layout.component.css"],
})
export class HomeLayoutComponent implements OnInit {
  isCollapsed = true;
  slideList: Array<Slide> = [];

  constructor(private router: Router) {
    this.slideList = SlideList.data;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
