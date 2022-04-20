import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

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
  toolTipDuration = 300;
  fileNames: string[];
  attachedPdffiles: File[];
  attachedfiles: File[];
  uploadedfiles: File[];
  @Input()
  pdfFileType: string;
  @Input()
  requiredFileType: string;

  constructor(
    private route: Router,
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

    this.pdfFileType = "application/pdf";
    this.requiredFileType = "image/*,application/pdf,.csv";
    this.uploadedfiles = [];
    this.attachedPdffiles = [];
    this.attachedfiles = [];
    this.fileNames = [];
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

  onPdfSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      // the list without the old pdf
      this.uploadedfiles = this.uploadedfiles.filter(
        (x) => !this.attachedPdffiles.includes(x)
      );
      // Empty the list
      this.attachedPdffiles = [];
      this.fileNames = [];
      // save the current filenames
      this.uploadedfiles.forEach((file) => this.fileNames.push(file.name));
      Array.from(files).forEach((file) => {
        // save current pdf files that have been attached
        this.attachedPdffiles.push(file);
        // add each to the list of the files to be uploaded
        this.uploadedfiles.push(file);
        // Add into the list, the name of the current file
        this.fileNames.push(file.name);
      });
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      this.uploadedfiles = this.uploadedfiles.filter(
        (x) => !this.attachedfiles.includes(x)
      );

      this.attachedfiles = [];
      this.fileNames = [];

      this.uploadedfiles.forEach((file) => this.fileNames.push(file.name));

      Array.from(files).forEach((file) => {
        this.attachedfiles.push(file);
        this.uploadedfiles.push(file);
        this.fileNames.push(file.name);
      });
    }
  }

  sendToAll() {
    const mailingList: MailingList = {
      message: this.mailForm.get("msg").value,
      recipients: this.recipients.value,
      subject: this.mailForm.get("subject").value,
      files: this.uploadedfiles,
    };
    this.newsLetterService.SendMailToAll(mailingList).subscribe({
      next: (result) => {
        if (result) {
          this.sent = true;
        }
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

  navigateToNewsletter() {
    this.route.navigate(["/newsletter"]);
  }
}
