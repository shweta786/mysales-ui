import { UserClient } from './user-client.model';
import * as _ from 'lodash';
import { UserRole } from './user-role.model';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

export class User {
  static empty: User = new User(0, "", "", "", "", "", "", false, true);

  public clients: UserClient[];
  public dirty: boolean;
  private static defaultPhoto: string = "/assets/img/avatar-2-256.png";
  private photoField: string = null;

  public get photoSrc() {
    // if (this.photoFileName === User.defaultPhoto || this.photoFileName === "" || this.photoFileName === null ||
    //     this.isPhotoAvailable === false || this.isPhotoAvailable === null) {
    //   return User.defaultPhoto;
    // }
    // let idx = this.photoFileName.lastIndexOf(".");
    // if (idx === -1 || idx === this.photoFileName.length - 1) {
    //   return User.defaultPhoto;
    // }
    // let ext = this.photoFileName.substr(idx + 1);
    // return "data:image/" + ext.toLowerCase() + ";base64," + this.photoBase64;
    if (this.photoField !== null) {
      return this.photoField;
    }
    let sessionKey = localStorage.getItem('sessionKey');
      let user = JSON.parse(localStorage.getItem('user')) || { username: '' };
      let username = user['username'];
      let filename = this.photoFileName;
    return `${BASE_URL}/user/photo/${this.id}?token=${username};${sessionKey}&filename=${filename}`;
  }

  public set photoSrc(src){
    this.photoField = src;
  }

  static fromJson(json: any): User {
    let user: User = null;
    if (_.isObject(json) && !_.isEmpty(json)) {
      user = new User(json.id || json.userId, json.userName, json.email, json.firstName,
        json.lastName, json.displayName, json.photoFileName, json.canManageAccess, json.retired);
      if (user.photoFileName === null || user.photoFileName === '') {
        user.photoFileName === User.defaultPhoto;
      }
      if (_.isArray(json.clients)) {
        for (let c of json.clients) {
          let newUserClient = new UserClient(c.userClientId, c.clientId);
          for (let r of c.roles) {
            newUserClient.roles.push(new UserRole(r.roleId, r.role));
          }
          user.clients.push(newUserClient);
        }
      }
    }
    return user;
  }

  static fromJsonList(array): User[] {
    return array.map(User.fromJson);
  }

  static fromJsonFlat({id, userName, email, firstName, lastName, displayName, photoFileName, canManageAccess, retired, photoBase64, clients}) {
    let ret = new User(
      id, userName, email, firstName, lastName, displayName, photoFileName, canManageAccess, retired
    );
    for (let c of clients) {
      let newUserClient = new UserClient(c.userClientId, c.clientId);
      for (let r of c.roles) {
        newUserClient.roles.push(new UserRole(r.roleId, r.role));
      }
      ret.clients.push(newUserClient);
    }
    return ret;
  }
  constructor(public id: number, public username: string, public email: string, public firstName: string,
    public lastName: string, public displayName: string, public photoFileName: string,
    public canManageAccess: boolean, public retired: boolean, public photoBase64?) {
    this.clients = [];
  }

  get status(): string {
    return this.retired ? 'Inactive' : 'Active' ;
  }

  set status(val: string) {
    this.retired = val === 'Inactive';
  }

  canViewPricing(clientId: number): boolean {
    let client = this.clients.find(x => x.clientId === clientId);
    if (!client) {
      return false;
    }
    return _.some(client.roles, {role: 'Adjust Price Sheets'});
  }
}
