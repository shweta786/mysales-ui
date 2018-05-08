import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ToastOptions } from 'ng2-toastr';
import {Component, Input, ViewContainerRef} from '@angular/core';
import {UserService} from '../../services/user.service';
import {SpinnyService} from '../../shared/spinny/spinny.service';
//import { Modal } from "angular2-modal/plugins/bootstrap";
import {Router} from '@angular/router';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less', './../login.component.less']
})
export class ResetPasswordComponent {
  @Input() username: string = "";

  constructor(private userService: UserService, private vcRef: ViewContainerRef, private spinnyService: SpinnyService,
             private router: Router,
            private _toastOptions: ToastOptions, private _toastr: ToastsManager) {
    // spinnyService.defaultViewContainer = vcRef;
    this._toastOptions.animate = 'fade';
    this._toastOptions.toastLife = 2500;
    this._toastOptions.showCloseButton = true;
    this._toastr.setRootViewContainerRef(vcRef);
  }

  resetPassword(): void {
    this.spinnyService.start();
    this.userService.requestPasswordChange(this.username).subscribe((result) => {
      if (result) {
        this.spinnyService.stop();
        // this._toastr.info("An email has been sent to you with instructions on how to change your password.", "Reset Password");
        // this.modal.alert().size("lg").isBlocking(true).showClose(true).title("Reset Password")
        //   .body("An email has been sent to you with instructions on how to change your password.").open().then((resultPromise) => {
        //   return resultPromise.result.then(() => {
        //     this.router.navigate(['login']);
        //   })
        // });
      }
      else {
        this.spinnyService.stop();
        this._toastr.error("User '" + this.username + "' does not exist.", 'Error');
        // this.modal.alert().size("lg").isBlocking(true).showClose(true).title("Error")
        //   .body("User '" + this.username + "' does not exist.").open();
      }
    }, (err) => {
      this.spinnyService.stop();
      console.error(err);
      this._toastr.error("An error was encountered - " + err, 'Error');
    //   this.modal.alert().size("lg").isBlocking(true).showClose(true).title("Error").body("An error was encountered - " + err).open();
    });
  }
}
