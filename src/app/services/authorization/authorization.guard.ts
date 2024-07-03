import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TokenstorageService } from '../tokenstorage/tokenstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard  {

  constructor(
    private tokenStorageStorage: TokenstorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.isConnected()) {
      return true;
    }

    // Since the user is not connected let redirect to the home page.
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private isConnected() {
    if (this.tokenStorageStorage.getUser()) {
      return true;
    }
    return false;
  }
}
