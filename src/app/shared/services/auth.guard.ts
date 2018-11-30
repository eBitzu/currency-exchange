import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(route, state) {
    try {
      const user = sessionStorage.getItem('loggedUser');
      this.login.currentUser = user;
      this.login.isLoggedIn = true;
      return true;
    } catch (err) {
      // nothing to do here
    }
    if (this.login.isLoggedIn) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
  constructor(
    private router: Router,
    private login: LoginService
  ) {}
}
