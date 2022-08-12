import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() {
    const user = sessionStorage.getItem('loggedUser');
    if (user) {
      this.login.currentUser = user;
      this.login.isLoggedIn = true;

      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
  constructor(
    private router: Router,
    private login: LoginService
  ) { }
}
