import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { User } from '../shared/model/user.model';
import { UserClient } from '../shared/model/user-client.model';
import { UserRole } from '../shared/model/user-role.model';
import { SecureHttp } from '../shared/secure-http';
import * as _ from 'lodash';
import {Client} from '../shared/model/client.model';
import { environment } from '../../environments/environment';

import { ClientService } from './client.service';

const BASE_URL = environment.apiBaseUrl;

export enum Roles {
  ViewOnly = 1,
  ViewAmount,
  EditHeader,
  AddEditItems,
  SubmitToClient,
  MarkReady,
  AdjustPriceSheets
}

@Injectable()
export class UserService {

  private loggedIn = false;
  currentUser: User = null;

  constructor(private http: Http, private secureHttp: SecureHttp, private clientService: ClientService) {
    this.loggedIn = !!localStorage.getItem('user');
  }

  private _clientId = -1;
  private _roles = {};

  resetRoles() {
    this._clientId = -1;
    this._roles = {};
  }

  getRoles() {
    var clientId = this.clientService.currentClientId;
    if(clientId === -1 || this._clientId == clientId) {
      return;
    }

    var user = this.getCurrentUser();

    var rolesList = user.clients.find(x => x.clientId == clientId);
    if(rolesList == void 0) 
      var roles: UserRole[] = [];
    else
      var roles = rolesList.roles;

    this._roles = {};
    for(var i = 0; i < 11; i++) {
      this._roles[i + 1] = roles.find(x => x.roleId == i + 1) !== void 0;
    }
    if(roles.length ==0){
      this._roles[1] = true;
    }
  }

  private _testUserHasRole(role: Roles): Boolean {
    if(role == 1) return false;
    else if(role == 2) return true;
    else if(role == 3) return true;
    else if(role == 4) return true;
    else if(role == 5) return true;
    else if(role == 6) return true;
    else if(role == 7) return false;
    else return false;
  }

  userHasClient(clientId) {
    var user = this.getCurrentUser();
    return _.filter(user.clients, {clientId: clientId}).length > 0;
  }

  userHasRole(role: Roles): Boolean {
    this.getRoles();
    let retval = false;
    if(this._roles[role] !== void 0) {
      retval = this._roles[role];
    }

    return retval;
  }

  login(username: string, password: string) {
    this.loggedIn = false;
    localStorage.removeItem('user');
    let url = `${BASE_URL}/login`;
    
    let body = new FormData();
    body.append('username', username);
    body.append('password', password);
    return this.http.post(url,body)
      .map((res: Response) => res.json())
      .map((res) => {
        if (res && res.data) {
          let userJson: any = res.data;
          let user = new User(userJson.id, userJson.userName, userJson.email, userJson.firstName,
                          userJson.lastName, userJson.displayName, userJson.photoFileName,
                          userJson.canManageAccess, userJson.retired);
          for (let c of userJson.clients) {
            let newUserClient = new UserClient(c.userClientId, c.clientId);
            for (let r of c.roles) {
              newUserClient.roles.push(new UserRole(r.roleId, r.role));
            }
            user.clients.push(newUserClient);
          }
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('sessionKey', userJson['sessionKey']);
          this.currentUser = user;
          this.loggedIn = true;
        }
        return this.loggedIn;
      })
      .catch((error) => {
        return Observable.of(false);
      });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  logout() {
    this.loggedIn = false;
    //this.currentUser = null;
    //localStorage.removeItem('user');
    return this.secureHttp.post(`${BASE_URL}/logout`, '')
      .map((res) => res.json());

  }

  getAll(): Observable<User[]> {
    let url = `${BASE_URL}/users`;
    return this.secureHttp.get(url)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map(User.fromJsonList);
  }

  createUser(newUser: User, password?: string): Observable<boolean> {
    let url = `${BASE_URL}/user`;
    let body = {
      userName: newUser.username,
      password: password ? password : '',
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      displayName: newUser.displayName,
      email: newUser.email,
      canManageAccess: newUser.canManageAccess,
      photo: null,
      photoFileName: ''
    };
    let jsonBody = JSON.stringify(body);
    return this.secureHttp.post(url, jsonBody)
      .map((res: Response) => {
        let body = res.json();
        return body;
      })
      .catch((err: any) => {
        console.error('Error in user service - createUser');
        console.error(err);
        return Observable.throw('Error creating new user');
    });

  }

  updateUser(user: User): Observable<boolean> {
    let url = `${BASE_URL}/users/${user.id}`;
    // let body = {
    //   manageAccess: user.canManageAccess,
    //   active: user.active
    // };
    // let jsonBody = JSON.stringify(body);
    return this.secureHttp.put(url, JSON.stringify(user)).catch((err: any) => {
      console.error('Error in user service - updateUser');
      console.error(err);
      return Observable.throw('Error updating user with id ' + user.id);
    });
  }

  updateUserRoles(userId: number, clientId: number, roleIds: number[]): Observable<boolean> {
    let url = `${BASE_URL}/users/${userId}/roles`;
    let body = {
      clientId: clientId,
      roles: roleIds
    };
    let jsonBody = JSON.stringify(body);
    return this.secureHttp.put(url, jsonBody).catch((err: any) => {
      console.error('Error in user service - updateUserRoles');
      console.error(err);
      return Observable.throw('Error updating user roles with user id ' + userId);
    });

  }

  getUser(): Observable<User> {
    let url = `${BASE_URL}/user`;
    // let user: User = null;

    return this.secureHttp.get(url)
      .map((res: Response) => {
        let body = res.json();
        return _.isObject(body.data) ? body.data : {};
      })
      .map((json) => User.fromJson(json))
      .catch((err: any) => {
        console.error('Error in user service - getUser');
        console.error(err);
        return Observable.throw('Error fetching current users profile');
      });
  }

  updateUserProfile(user: User): Observable<boolean> {
    let url = `${BASE_URL}/user`;
    let body = {
      userName: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      displayName: user.displayName,
      photo: user.photoBase64,
      photoFileName: user.photoFileName
    };
    let jsonBody = JSON.stringify(body);
    return this.secureHttp.put(url, jsonBody)
      .do((res: Response) => {
        this.currentUser = user;
      })
      .map((res: Response) => {
        let body = res.json();
        return body.status === 200;
      })
      .catch((err: any) => {
        console.error('Error in user service - updateUserProfile');
        console.error(err);
        return Observable.throw('Error updating user profile for user id ' + user.id);
      });
  }

  deleteUserRoles(userId: number, userClientId: number): Observable<boolean> {
    let url = `${BASE_URL}/users/${userId}/roles/${userClientId}`;
    return this.secureHttp.delete(url).catch((err: any) => {
      console.error('Error in user service - deleteUserRoles');
      console.error(err);
      return Observable.throw('Error deleting user roles for user id ' + userId);
    });
  }

  requestPasswordChange(username: string): Observable<boolean> {
    let url = `${BASE_URL}/user/${username}/requestpasswordchange`;
    let options = new RequestOptions({
      headers: new Headers({
        'content-type': 'application/json'
      })
    });
    return this.http.post(url, null, options)
      .map((res: Response) => {
        return res.json()
      })
      .map((json: any) => {
        return json.status === 200;
      })
      .catch((err: any) => {
        console.error('Error in user service - requestPasswordChange');
        console.error(err);
        return Observable.throw('Error requesting password change for user ' + username);
      });
  }

  changePassword(username: string, token: string, newPassword: string): Observable<boolean> {
    let url = `${BASE_URL}/user/changepassword`;
    let options = new RequestOptions({
      headers: new Headers({
        'content-type': 'application/json'
      })
    });
    let body = {
      token: token,
      newPassword: newPassword,
      username: username
    };
    let jsonBody = JSON.stringify(body);
    return this.http.post(url, jsonBody, options)
      .map((res: Response) => {
        return res.json()
      })
      .map((json: any) => {
        return json.status === 200;
      })
      .catch((err: any) => {
        console.error('Error in user service - changePassword');
        console.error(err);
        return Observable.throw('Error changing password for user ' + username);
      });
  }

  isAdministrator() {
    return !!this.getCurrentUser().canManageAccess;
  }

  getCurrentUser(): User {
    if (this.currentUser === null) {
      this.currentUser = User.fromJsonFlat(JSON.parse(localStorage.getItem('user')));
    }
    return this.currentUser;
  }

  canViewPricing() {
    return true;
  }

}
