import { ToastOptions, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, Input, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SpinnyService } from '../../shared/spinny/spinny.service';
// import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less', './../login.component.less']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @Input() newPassword: string = "";
  @Input() newPassword2: string = "";
  token: string = "";
  username: string = "";
  routeQuerySub: Subscription = null;
  missingInfo: boolean = false;

  constructor(private userService: UserService, private vcRef: ViewContainerRef, private spinnyService: SpinnyService,
    private router: Router, private route: ActivatedRoute,
    private _toastOptions: ToastOptions, private _toastr: ToastsManager) {
    // spinnyService.defaultViewContainer = vcRef;
    this._toastOptions.animate = 'fade';
    this._toastOptions.toastLife = 2500;
    this._toastOptions.showCloseButton = true;
    this._toastr.setRootViewContainerRef(vcRef);

    this.routeQuerySub = this.route.queryParams.subscribe(val => {
      if (!_.isUndefined(val['token'])) {
        this.token = val['token'];
      }
      if (!_.isUndefined(val['username'])) {
        this.username = val['username'];
      }
      this.missingInfo = this.username === "" || this.token === "";
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.routeQuerySub !== null) {
      this.routeQuerySub.unsubscribe();
      this.routeQuerySub = null;
    }
  }

  changePassword(): void {
    this.spinnyService.start();
    this.userService.changePassword(this.username, this.token, this.newPassword).subscribe((result) => {
      if (result) {
        this.spinnyService.stop();
        // this._toastr.info("Your password has been changed.  Please log in again.", "Password Changed");
        // this.modal.alert().size("lg").isBlocking(true).showClose(true).title("Password Changed")
        //   .body("Your password has been changed.  Please log in again.").open().then((resultPromise) => { //this promise fires when the dialog is opened
        //     return resultPromise.result.then((result) => { //this promise fires when the dialog is closed
        //       this.userService.logout();
        //       this.router.navigate(['login']);
        //     });
        //   });
      }
      else {
        this.spinnyService.stop();
        this._toastr.error("An error was encountered while changing your password.  Please contact your administrator.", 'Error');
        // this.modal.alert().size("lg").isBlocking(true).showClose(true).title("Error").body("An error was encountered while changing your password.  Please contact your administrator.").open();
      }
    }, (err) => {
      this.spinnyService.stop();
      console.error(err);
      this._toastr.error("An error was encountered - " + err, 'Error');
      //   this.modal.alert().size("lg").isBlocking(true).showClose(true).title("Error").body("An error was encountered - " + err).open();
    });
  }
}
