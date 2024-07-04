import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';

import { AdminService } from 'src/app/services/admin/admin.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatDividerModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, MatButtonModule, MatIconModule]
})
export class RegisterComponent implements OnInit, AfterViewInit {

  // Defines userForm
  userForm = new FormGroup({
    // firstname
    firstname: new FormControl("", [Validators.required]),
    // lastname
    lastname: new FormControl("", [Validators.required]),
    // email
    email: new FormControl("", [Validators.required, Validators.email]),
    // password
    pwd: new FormControl("", [Validators.required, Validators.minLength(8)]),
    // pwdRepeat
    pwdRepeat: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  // Defines hide. By default we hide the password input field.
  hidePwd = true;
  // Defines hideConfirmPwd
  hideConfirmPwd = true;
  // Defines isFormValid
  isFormValid = false;

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.onFormValuesChanged();
  }

  initForm() {
    this.userForm.setValue({
      lastname: '',
      firstname: '',
      email: '',
      pwd: '',
      pwdRepeat: ''
    });
  }

  onFormValuesChanged() {
    this.userForm.valueChanges.subscribe(() => {
      if (this.userForm.get("lastname").valid &&
          this.userForm.get("firstname").valid &&
          this.userForm.get("email").valid &&
          this.userForm.get("pwd").valid &&
          this.userForm.get("pwd").value ===
          this.userForm.get("pwdRepeat").value
      ) {
        this.isFormValid = true;
      } else {
        this.isFormValid = false;
      }
    });
  }

  register() {

  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }
}
