import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { TokenstorageService } from 'src/app/services/tokenstorage/tokenstorage.service';

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
  // Defines errorMessage
  errorMessage = '';
  // Defines uri
  uri: string = "/verwaltung";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthentificationService,
    private tokenStorageService: TokenstorageService
  ) { }

  ngOnInit() {
    // if the user is already connected and try to access the login page, then redirect to the dashboard
    if (this.isConnected()) {
      this.router.navigate([this.uri]);
    }
    // Otherwise we display the page and get the page that the user wanted to access
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
    if (this.loginForm.get('email').valid && this.loginForm.get('pwd').valid) {
      const user = {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('pwd').value
      };

      this.authService.login(user).subscribe({
        next: (data) => {
          this.tokenStorageService.saveUser(data);
          this.tokenStorageService.saveToken(data.token);
          this.tokenStorageService.saveRefreshToken(data.refreshToken);
          // redirected page if connection successful
          this.uri = this.activatedRoute.snapshot.queryParams.returnUrl;
        },
        error: (err) => {
          if (err?.error) {
            const msg: string = err.error?.error;
            if (msg.toLowerCase() === 'bad credentials') {
              this.errorMessage = 'Benutzername und/oder Passwort sind falsch!';
            }
          }
        },
        complete: () => this.router.navigateByUrl(this.uri)
      });
    }
  }

  /** Check whether the user is already connected or not */
  private isConnected(): boolean {
    if (this.tokenStorageService.getUser()) {
      return true;
    }
    return false;
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
