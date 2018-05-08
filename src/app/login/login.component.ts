import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { UserService } from '../services/user.service';
import { SpinnyService } from '../shared/spinny/spinny.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  login = {
    username: '',
    password: ''
  };
  showErrorMessage = false;

  constructor(private router: Router, private userService: UserService,
    private spinnyService: SpinnyService,
    private vcRef: ViewContainerRef,
    private _toastr: ToastsManager,
    private _toastOptions: ToastOptions, ) {
    this._toastOptions.animate = 'fade';
    this._toastOptions.toastLife = 2500;
    this._toastOptions.showCloseButton = true;
    this._toastr.setRootViewContainerRef(vcRef);
  }

  ngOnInit() {
    this.spinnyService.stop();
  }

  authenticateUser() {
    this.userService.login(this.login.username, this.login.password)
      .subscribe((result) => {
        if (result) {
          this.userService.resetRoles();
          this.router.navigateByUrl('/dashboard/estimates');
        } else {
          //this.showErrorMessage = true;
          this._toastr.error(`Login Failed`, 'Error', this._toastOptions);
        }
      });
  }

}