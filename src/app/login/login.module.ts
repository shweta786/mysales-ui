import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
// import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { ChangePasswordComponent } from './change-password/change-password.component';

import { ToastsManager, ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule],
  declarations: [LoginComponent
    // ,
    // ResetPasswordComponent, ChangePasswordComponent
  ],
  exports: [LoginComponent],
  providers: [ToastsManager,
    ToastOptions]
})

export class LoginModule { }
