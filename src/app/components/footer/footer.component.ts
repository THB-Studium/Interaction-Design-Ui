import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { NewsLettersService } from "src/app/services/news-letters/news-letters.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  currentDate: Date = new Date();

  emailCtrl: FormControl;

  constructor(
    private toastr: ToastrService,
    private newLetterService: NewsLettersService
  ) {
    this.emailCtrl = new FormControl('', [Validators.email, Validators.required]);
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
