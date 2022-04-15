import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { NewsLettersService } from "src/app/services/news-letters/news-letters.service";
import { ToastrService } from "ngx-toastr";

import { MailingList } from "src/app/models/mailingList";

@Component({
  selector: "app-mailing-list-form",
  templateUrl: "./mailing-list-form.component.html",
  styleUrls: ["./mailing-list-form.component.css"],
})
export class MailingListFormComponent implements OnInit {
  mailForm: FormGroup;
  // Define recipients. List of person to who to mail will be sent
  recipients = new FormControl();
  recipientList: string[];
  sent: boolean;

  constructor(
    private fb: FormBuilder,
    private newsLetterService: NewsLettersService,
    private toastrService: ToastrService
  ) {
    this.mailForm = this.fb.group({
      msg: ["", [Validators.required]],
      subject: [""],
    });

    this.sent = false;
    this.recipientList = [];
  }

  ngOnInit(): void {
    // Get subscribers
    this.getAllSubscribers();
  }

  private getAllSubscribers() {
    this.newsLetterService.GetSubscribers().subscribe({
      next: (result) => result.forEach((x) => this.recipientList.push(x)),
      error: () =>
        this.toastrService.error(
          "Die Liste der Abonnenten konnte nicht geladen werden.",
          "Fehler"
        ),
      complete: () => {
        this.recipientList.sort();
      },
    });
  }

  sendToAll() {
    const mailingList: MailingList = {
      message: this.mailForm.get("msg").value,
      recipient: this.recipients.value,
      subject: this.mailForm.get("subject").value,
    };
    this.newsLetterService.SendMailToAll(mailingList).subscribe({
      next: (result) => {
        console.log(result);
        this.sent = true;
      },
      error: () => {
        this.toastrService.error(
          "Die Mail konnte nicht gesendet werden.",
          "Fehler"
        );
      },
      complete: () => {
        this.toastrService.success("Die E-Mail wurde erfolgreich gesendet.");
      },
    });
  }
}
