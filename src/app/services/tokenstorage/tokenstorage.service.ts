import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class TokenstorageService {
  readonly USER_KEY = 'user';
  readonly TOKEN_KEY = 'secretfortravel';
  readonly REFRESHTOKEN_KEY = 'secretfortravel';

  constructor(private localStorageService: LocalStorageService) { }

  public saveUser(user): void {
    this.localStorageService.clear(this.USER_KEY);
    this.localStorageService.store(this.USER_KEY, user);
  }

  public getUser(): any {
    const user = this.localStorageService.retrieve(this.USER_KEY);
    if (user)
      return user;
    return null;
  }

  public saveToken(token: string) {
    this.localStorageService.clear(this.TOKEN_KEY);
    this.localStorageService.store(this.TOKEN_KEY, token);

    const user = this.getUser();
    if (user.userUuid) {
      this.saveUser({ user, accessToken: token });
    }
  }

  public getToken(): string {
    return this.localStorageService.retrieve(this.TOKEN_KEY);
  }

  public setUsername(username: string) {
    this.getUser().username = username;
    this.saveUser(this.getUser());
  }

  public clear() {
    this.localStorageService.clear(this.USER_KEY);
  }

  public saveRefreshToken(token: string): void {
    this.localStorageService.clear(this.REFRESHTOKEN_KEY);
    this.localStorageService.store(this.REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return this.localStorageService.retrieve(this.REFRESHTOKEN_KEY);
  }
}
