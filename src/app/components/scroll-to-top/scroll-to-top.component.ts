import { Component, OnInit, Inject, HostListener } from "@angular/core";
import { DOCUMENT, ViewportScroller, NgClass } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: "app-scroll-to-top",
    templateUrl: "./scroll-to-top.component.html",
    styleUrls: ["./scroll-to-top.component.css"],
    standalone: true,
    imports: [NgClass],
})
export class ScrollToTopComponent implements OnInit {
  windowScrolled: boolean;

  constructor(
    private router: Router,
    private viewScroller: ViewportScroller,
    @Inject(DOCUMENT) private document: Document
  ) {}
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }
  scrollToTop() {
    console.log("hello");
    this.viewScroller.scrollToPosition([0, 0]);
  }

  ngOnInit(): void {}
}
