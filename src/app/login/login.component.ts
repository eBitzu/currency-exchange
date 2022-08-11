import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../shared/services/login.service';
import { LoginError } from '../shared/models/shared.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formSubmited = false;
  constructor(private lgnSrv: LoginService, private router: Router) {}
  login = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
  get user(): string {
    return this.login.get('user').value;
  }
  get pass(): string {
    return this.login.get('pass').value;
  }
  validateCred() {
    this.formSubmited = true;
    const user = {
      username: this.user,
      password: this.pass
    };

    const resp = this.lgnSrv.validateUser(user);
    switch (resp) {
      case LoginError.USERNAME_NOT_FOUND:
        this.login.get('user').setErrors({ invalid: true });
        return;
      case LoginError.INVALID_PASSWORD:
        this.login.get('pass').setErrors({ invalid: true });
        return;
      default:
        alert(`Welcome ${resp}`);
        this.router.navigate(['/home']);
        break;
    }
  }
}
