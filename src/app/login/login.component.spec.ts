/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';

describe('Component: Login', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        FormsModule, HttpModule
      ],
      providers: [
        { provide: UserService, useClass: UserService },
        { provide: Router, useClass: RouterStub },
        { provide: SecureHttp, useClass: SecureHttp }
      ]
    });
  }));
  it('should create an instance', inject([Router, UserService], (router: Router, userService: UserService) => {
    let component = new LoginComponent(router, userService);
    expect(component).toBeTruthy();
  }));
  describe('when the login page loads', () => {
    it('then the login name should be defaulted', inject([Router, UserService], (router: Router, userService: UserService) => {
      let component = new LoginComponent(router, userService);
      expect(component.login.username).toEqual('kiran');
    }));
    it('then the error message should not be displayed', inject([Router, UserService], (router: Router, userService: UserService) => {
      let component = new LoginComponent(router, userService);
      expect(component.showErrorMessage).toBe(false);
    }));
  });
  describe('when a valid username and password are entered', () => {
    it('then the home route should be displayed', inject([Router, UserService], (router: Router, userService: UserService) => {
      spyOn(userService, 'login').and.returnValue(Observable.of(true));
      spyOn(router, 'navigateByUrl').and.returnValue('');
      let component = new LoginComponent(router, userService);
      component.authenticateUser();
      expect(router.navigateByUrl).toHaveBeenCalled();
    }));
  });
  describe('when an invalid username and password are entered', () => {
    it('then Login Failed should be displayed', inject([Router, UserService], (router: Router, userService: UserService) => {
      spyOn(userService, 'login').and.returnValue(Observable.of(false));
      spyOn(router, 'navigateByUrl').and.returnValue('');
      let component = new LoginComponent(router, userService);
      component.authenticateUser();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(component.showErrorMessage).toBe(true);
    }));
  });
});

class RouterStub {
  navigateByUrl(url: string) { return url; }
}
