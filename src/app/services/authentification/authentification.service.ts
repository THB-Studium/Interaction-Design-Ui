import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TokenstorageService } from '../tokenstorage/tokenstorage.service';

import { Server } from 'src/app/variables/server';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  // API for user authentification
  readonly AUTHENTIFICATION_URL: string = `${Server.API_URL}/adminPanel/authenticate`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorageService: TokenstorageService
  ) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.AUTHENTIFICATION_URL, {
      email: credentials.email,
      password: credentials.password
    }, { headers: this.headers }).pipe(map(user => {
      // Store the user details and token to keep user logged in between page refreshes
      this.tokenStorageService.saveUser(user);
      return user;
    }));
  }

  refreshToken(token: string) {
    return this.http.post(`${Server.API_URL}/adminPanel/refreshtoken`, {
      refreshToken: token
    }, { headers: this.headers });
  }

  logOut() {
    this.tokenStorageService.clear();
    if (!this.tokenStorageService.getUser()) {
      this.router.navigateByUrl('/');
    } else {
      window.location.reload();
    }
  }
}
