import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { NewsLettersService } from "src/app/services/news-letters/news-letters.service";

import { Pattern } from "src/app/variables/pattern";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  @Input() btnColor: any;
  currentDate: Date = new Date();

  emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private newLetterService: NewsLettersService
  ) {}

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(Pattern.email)]],
    });
  }

  abonnieren() {
    let subscribe = {
      email: this.emailForm.get("email").value,
      active: true,
    };

    this.newLetterService.subscribe(subscribe).subscribe({
      next: () => this.toastr.success("Successfully subscribed", "Success"),
      error: () => {
        this.toastr.success(
          "Error while subscribing to the newsletters!",
          "Error"
        )
      }
    });
  }
}
