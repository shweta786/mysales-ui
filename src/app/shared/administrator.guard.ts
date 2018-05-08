import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class AdministratorGuard implements CanActivate {
  constructor(private user: UserService, private router: Router) {}

  canActivate() {
    if (this.user.isAdministrator()) {
        return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}
