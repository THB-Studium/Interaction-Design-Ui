import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

import { AuthentificationService } from '../authentification/authentification.service';
import { TokenstorageService } from '../tokenstorage/tokenstorage.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthentificationService, private tokenstorageService: TokenstorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.tokenstorageService.getToken();
    if (token != null) {
      request = this.addTokenHeader(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !request.url.includes('adminPanel/authenticate') &&
          error.status === 401
        ) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenstorageService.getToken();

      if (token) {
        return this.authService.refreshToken(token).pipe(
          switchMap((newToken: any) => {
            this.isRefreshing = false;

            this.tokenstorageService.saveToken(newToken.accessToken);
            this.refreshTokenSubject.next(newToken.accessToken);

            return next.handle(this.addTokenHeader(request, newToken.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.authService.logOut();
            return throwError(() => new Error(err));
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
