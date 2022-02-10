import { Component, OnInit, Inject, Input, HostListener } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { DOCUMENT, ViewportScroller } from "@angular/common";

import { ToastrService } from "ngx-toastr";
import { NewsLettersService } from "src/app/services/news-letters/news-letters.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  windowScrolled: boolean;
  @Input() buttonColor: any
  currentDate: Date = new Date();
  emailCtrl: FormControl;

  constructor(
    private toastr: ToastrService,
    private newLetterService: NewsLettersService,
    @Inject(DOCUMENT) private document: Document,
    private viewScroller: ViewportScroller
  ) {
    this.emailCtrl = new FormControl("", [
      Validators.email,
      Validators.required,
    ]);
  }
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
  ngOnInit() {}

  abonnieren() {
    if (this.emailCtrl.valid) {
      let subscribe = {
        email: this.emailCtrl.value,
        active: true,
      };

      this.newLetterService.subscribe(subscribe).subscribe({
        next: () => this.toastr.success("Sie sind abonniert."),
        error: () => {
          this.toastr.error("Ihr Abonnement ist fehlgeschlagen");
        },
      });
    }
  }
}
