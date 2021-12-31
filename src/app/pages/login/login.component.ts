import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  // Defines loginForm
  loginForm = new FormGroup({
    // email
    email: new FormControl("", [Validators.required, Validators.email]),
    // password
    pwd: new FormControl("", [Validators.required, Validators.minLength(8)]),
  });

  // Defines hide. By default we hide the password input field.
  hidePwd = true;
  // Defines isFormValid
  isFormValid = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.onFormChanged();
  }

  private initForm() {
    this.loginForm.setValue({
      email: '',
      pwd: ''
    });
  }

  private onFormChanged() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginForm.get('email').valid && this.loginForm.get('pwd').valid) {
        this.isFormValid = true;
      } else {
        this.isFormValid = false;
      }
    });
  }

  login() {

  }

  navigateToRegistrationPage() {
    this.router.navigate(['/register']);
  }
}
