import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppUser, LoginError } from '../models/shared.models';
import users from 'src/assets/mocks/users';


@Injectable()
export class LoginService {
  constructor(private router: Router) {
    this._username = 'anon';
  }
  get isLoggedIn(): boolean {
    return this._isLogged;
  }
  set isLoggedIn(val: boolean) {
    this._isLogged = val;
  }

  get currentUser(): string {
    return this._username;
  }
  set currentUser(v: string) {
    this._username = v;
  }
  private _isLogged = false;
  private _username: string;

  logOut() {
    this.isLoggedIn = false;
    sessionStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }
  validateUser(user: AppUser): string {
    const validated = this.validateBE(user);
    if (typeof validated === 'string') {
      return validated;
    }
    this.isLoggedIn = true;
    sessionStorage.setItem('loggedUser', validated.username);
    this.currentUser = validated.username;
    return validated.fullName;
  }
  private validateBE(user: AppUser): string | AppUser {
    // this logic should be in BE
    const foundUser = users.find(el => el.username === user.username);
    if (!foundUser) {
      return LoginError.USERNAME_NOT_FOUND;
    }
    if (foundUser.password !== user.password) {
      return LoginError.INVALID_PASSWORD;
    }
    return foundUser;
  }
}
