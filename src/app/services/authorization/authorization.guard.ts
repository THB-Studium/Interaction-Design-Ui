import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {TokenstorageService} from '../tokenstorage/tokenstorage.service';

export const isAuthenticated: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  tokenStorageStorage: TokenstorageService = inject(TokenstorageService),
  router: Router = inject(Router),
): Promise<boolean> | boolean => {

  return tokenStorageStorage.getUser() || router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
};
