import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FeedbackService } from "src/app/services/feedback/feedback.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
    selector: "app-feedback-form",
    templateUrl: "./feedback-form.component.html",
    styleUrls: ["./feedback-form.component.css"],
    standalone: true,
    imports: [
        MatDialogModule,
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatInputModule,
        NgIf,
        MatIconModule,
        MatButtonModule,
    ],
})
export class FeedbackFormComponent implements OnInit {
  feedbackForm: FormGroup;
  selectedFile: any;
  fileInputByte: any;
  selectedFileName: string;
  isImgSelected = false;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      name: ["", [Validators.required]],
      feedback: ["", [Validators.required, Validators.minLength(6)]],
      image: ["No Image Selected"],
    });
  }

  selectFile(event: any) {
    let name = [];
    this.selectedFile = event.target.files;
    if (this.selectedFile && this.selectedFile.item(0)) {
      this.isImgSelected = true;
      // set the value of the input
      name.push(this.selectedFile.item(0).name);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileInputByte = reader.result;
      };
      this.selectedFileName = name[0];
      this.feedbackForm.get("image").setErrors(null);
    } else {
      this.feedbackForm.get("image").setErrors({ valid: true });
      this.isImgSelected = false;
    }
  }

  sendFeedback() {
    let feedback = {
      autor: this.feedbackForm.get("name").value,
      description: this.feedbackForm.get("feedback").value,
      bild: this.isImgSelected ? this.fileInputByte : null
    };

    this.feedbackService.addOne(feedback).subscribe({
      next: (response) => {
        this.toaster.success("Danke für Ihr Feedback", "Gesendet");
      },

      error: () => {
        this.toaster.error("Fehler beim Senden Ihres Feedbacks", "Fehler");
      },
    });
  }
}
